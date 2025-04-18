﻿using BerAuto.DataContext.Context;
using BerAuto.DataContext.Dtos;
using BerAuto.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace BerAuto.Services
{
    public interface IRentService
    {
        Task<RentDto> CreateRentAsync(RentCreateDto rentCreateDto, int? userId);
        Task<bool> AcceptRentAsync(int rentId);
        Task<IList<RentDto>> GetPreviousRents(int userId);
        Task<IList<RentDto>> GetAcceptedRents();
        Task<IList<RentDto>> GetFinishedRents();
        Task<IList<RentDto>> GetPendingRents();
    }

    public class RentService : IRentService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public RentService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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

        public async Task<bool> AcceptRentAsync(int rentId)
        {
            var rent = await _context.Rents.FirstOrDefaultAsync(o => o.Id == rentId && o.RentStatus == 0);
            if (rent is null)
            {
                throw new Exception($"No rent found with id: {rentId} or status is not pending");
            }
            rent.RentStatus = RentStatus.Accepted;
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
            var rents = await _context.Rents.Where(r => r.RentStatus == RentStatus.Accepted).ToListAsync();
            return _mapper.Map<IList<RentDto>>(rents);
        }

        public async Task<IList<RentDto>> GetFinishedRents()
        {
            var rents = await _context.Rents.Where(r => r.RentStatus == RentStatus.Finished).ToListAsync();
            return _mapper.Map<IList<RentDto>>(rents);
        }

        public async Task<IList<RentDto>> GetPendingRents()
        {
            var rents = await _context.Rents.Where(r => r.RentStatus == RentStatus.Pending).ToListAsync();
            return _mapper.Map<IList<RentDto>>(rents);
        }
    }
}
