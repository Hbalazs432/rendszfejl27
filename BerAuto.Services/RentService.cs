using BerAuto.DataContext.Context;
using BerAuto.DataContext.Dtos;
using BerAuto.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Runtime.ConstrainedExecution;

namespace BerAuto.Services
{
    public interface IRentService
    {
        Task<RentDto> CreateRentAsync(RentCreateDto rentCreateDto, int? userId);
        Task<bool> AcceptRentAsync(int rentId);
        Task<bool> DeclineRentAsync(int rentId);
        Task<bool> FinishRentAsync(int rentId);
        Task<IList<RentDto>> GetPreviousRents(int userId);
        Task<IList<RentDto>> GetAcceptedRents();
        Task<IList<RentDto>> GetFinishedRents();
        Task<IList<RentDto>> GetPendingRents();
        Task<IList<RentDto>> GetDeclinedRents();
        Task<IList<RentDto>> GetRentsByUser(int userId);
    }

    public class RentService : IRentService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly EmailService _emailService;
        private readonly BillingService _billingService;

        public RentService(AppDbContext context, IMapper mapper, EmailService emailService, BillingService billingService)
        {
            _context = context;
            _mapper = mapper;
            _emailService = emailService;
            _billingService = billingService;
        }
        public async Task<RentDto> CreateRentAsync(RentCreateDto rentCreateDto, int? userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            var rent = _mapper.Map<Rent>(rentCreateDto);
            rent.RentStatus = RentStatus.Pending;
            if (user != null)
            {
                rent.UserId = userId;
                rent.AddressId = user.AddressId;
            }
            else
            {
                if (rentCreateDto.Email != null)
                    rent.Email = rentCreateDto.Email;
                else throw new Exception("Can't make a rent without an email address");
            }

            await _context.Rents.AddAsync(rent);
            await _context.SaveChangesAsync();
            return _mapper.Map<RentDto>(rent);
        }

        public async Task<bool> DeclineRentAsync(int rentId)
        {
            try
            {
                var rentToDecline = await _context.Rents
                    .FirstOrDefaultAsync(r => r.Id == rentId && r.RentStatus == RentStatus.Pending);

                if (rentToDecline == null)
                {
                    Console.WriteLine($"[INFO] No pending rent found with id: {rentId}");
                    throw new Exception($"Nincs elutasítható bérlés ezzel az ID-val: {rentId}");
                }

                rentToDecline.RentStatus = RentStatus.Denied;

                var car = await _context.Cars.FirstOrDefaultAsync(c => c.Id == rentToDecline.CarId);

                Console.WriteLine($"[INFO] Rent #{rentId} elutasítva. Email küldése: {rentToDecline.Email}");

                await _emailService.SendEmailAsync(
                    rentToDecline.Email,
                    "Bérlési igény elutasítva", $@"
                    Tisztelt Uram / Hölgyem!

                    Sajnálattal értesítjük, hogy az Ön autóbérlési igényét elutasítottuk.

                    Részletek:
                    - Autó: {car?.Brand} {car?.Model}
                    - Bérlés kezdete: {rentToDecline.StartDate:yyyy-MM-dd}
                    - Bérlés vége: {rentToDecline.EndDate:yyyy-MM-dd}

                    Megértését köszönjük.

                    BérAutó csapat",
                    null, null
                );

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] {ex.Message}");
                throw;
            }
        }

        public async Task<bool> AcceptRentAsync(int rentId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var acceptedRent = await _context.Rents.FirstOrDefaultAsync(o => o.Id == rentId && o.RentStatus == RentStatus.Pending);

                if (acceptedRent is null)
                {
                    throw new Exception($"No rent found with id: {rentId} or status is not pending");
                }

                Console.WriteLine($"[Elfogadás] RentId: {rentId}, AddressId: {acceptedRent.AddressId}, Email: {acceptedRent.Email}");

                if (string.IsNullOrWhiteSpace(acceptedRent.Email))
                {
                    throw new Exception("Elfogadott bérléshez nem tartozik érvényes e-mail cím (acceptedRent.Email is null or empty).");
                }

                acceptedRent.RentStatus = RentStatus.Accepted;

                var deniedRents = await _context.Rents
                    .Where(r => r.CarId == acceptedRent.CarId &&
                                r.RentStatus == RentStatus.Pending &&
                                r.StartDate <= acceptedRent.EndDate &&
                                r.EndDate >= acceptedRent.StartDate &&
                                r.Id != rentId)
                    .ToListAsync();

                foreach (var rent in deniedRents)
                {
                    Console.WriteLine($"[Elutasítás] RentId: {rent.Id}, Email: {rent.Email}");

                    if (string.IsNullOrWhiteSpace(rent.Email))
                    {
                        Console.WriteLine($"[WARN] Elutasított bérléshez nincs megadva e-mail cím. RentId: {rent.Id}");
                        continue; // kihagyjuk az email küldést, de nem dobunk hibát
                    }

                    rent.RentStatus = RentStatus.Denied;

                    var carDeclined = await _context.Cars.FirstOrDefaultAsync(c => c.Id == rent.CarId);

                    await _emailService.SendEmailAsync(
                        rent.Email,
                        "Bérlési igény elutasítva", $@"
                        Tisztelt Uram / Hölgyem!

                        Sajnálattal értesítjük, hogy az Ön autóbérlési igényét elutasítottuk.

                        Részletek:
                        - Autó: {carDeclined?.Brand} {carDeclined?.Model}
                        - Bérlés kezdete: {rent.StartDate:yyyy-MM-dd}
                        - Bérlés vége: {rent.EndDate:yyyy-MM-dd}

                        Megértését köszönjük.

                        BérAutó csapat",
                        null,
                        null
                    );
                }

                var car = await _context.Cars.FirstOrDefaultAsync(c => c.Id == acceptedRent.CarId);

                await _emailService.SendEmailAsync(
                    acceptedRent.Email,
                    "Bérlési igény elfogadva", $@"
                    Tisztelt Uram / Hölgyem!

                    Elfogadtuk az autóbérlési igényét.

                    Részletek:
                    - Autó: {car?.Brand} {car?.Model}
                    - Bérlés kezdete: {acceptedRent.StartDate:yyyy-MM-dd}
                    - Bérlés vége: {acceptedRent.EndDate:yyyy-MM-dd}

                    BérAutó csapat",
                    null,
                    null
                );

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] {ex.Message}");
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> FinishRentAsync(int rentId)
        {
            var rent = await _context.Rents.FirstOrDefaultAsync(o => o.Id == rentId && o.RentStatus == RentStatus.Accepted);
            if (rent is null)
            {
                throw new Exception($"No rent found with id: {rentId} or status is not accepted");
            }

            var car = await _context.Cars.FirstOrDefaultAsync(c => c.Id == rent.CarId);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == rent.UserId);
            string name;

            if (user == null) { name = "name"; }
            else { name = user.Name; }

            int days = (rent.EndDate.ToDateTime(TimeOnly.MinValue) - rent.StartDate.ToDateTime(TimeOnly.MinValue)).Days;
            double amount = days * car.Price;

            var invoice = new InvoiceDto
            {
                RentId = rentId,
                CustomerName = name,
                Car = car.Brand + " " + car.Model,
                StartDate = rent.StartDate,
                EndDate = rent.EndDate,
                InvStartDate = DateOnly.FromDateTime(DateTime.Today),
                InvEndDate = DateOnly.FromDateTime(DateTime.Today.AddDays(5)),
                Days = days,
                Price = car.Price,
                TotalAmount = amount
            };

            var pdfBytes = _billingService.GenerateInvoicePdf(invoice);

            await _emailService.SendEmailAsync(rent.Email,
                    "Számlája érkezett", $@"
                    Tisztelt Uram / Hölgyem! 

                    Csatolva küldjük a számláját az autóbérlésről.

                    BérAutó csapat", pdfBytes, "invoice.pdf");

            rent.RentStatus = RentStatus.Finished;
            _context.Rents.Update(rent);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<IList<RentDto>> GetPreviousRents(int userId)
        {
            var rents = await _context.Rents.Where(r => r.UserId == userId && r.RentStatus == RentStatus.Finished).ToListAsync();
            return _mapper.Map<IList<RentDto>>(rents);
        }

        public async Task<IList<RentDto>> GetAcceptedRents()
        {
            var rents = await _context.Rents.Where(r => r.RentStatus == RentStatus.Accepted).Include(r => r.Car).ToListAsync();
            return _mapper.Map<IList<RentDto>>(rents);
        }

        public async Task<IList<RentDto>> GetFinishedRents()
        {
            var rents = await _context.Rents.Where(r => r.RentStatus == RentStatus.Finished).Include(r => r.Car).ToListAsync();
            return _mapper.Map<IList<RentDto>>(rents);
        }

        public async Task<IList<RentDto>> GetDeclinedRents()
        {
            var rents = await _context.Rents.Where(r => r.RentStatus == RentStatus.Denied).Include(r => r.Car).ToListAsync();
            return _mapper.Map<IList<RentDto>>(rents);
        }

        public async Task<IList<RentDto>> GetPendingRents()
        {
            var rents = await _context.Rents.Where(r => r.RentStatus == RentStatus.Pending).Include(r =>r.Car).ToListAsync();
            return _mapper.Map<IList<RentDto>>(rents);
        }

        public async Task<IList<RentDto>> GetRentsByUser(int userId)
        {
            var rents = await _context.Rents
                .Where(r => r.UserId == userId)
                .Include(r => r.Car)
                .ToListAsync();

            return _mapper.Map<IList<RentDto>>(rents);
        }
    }
}
