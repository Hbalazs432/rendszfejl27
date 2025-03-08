using BerAuto.DataContext.Context;
using BerAuto.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BerAuto.Services
{
    public interface ICarRentalService
    {
        List<CarRental> List();
    }
    public class CarRentalService : ICarRentalService
    {
        private readonly AppDbContext _context;

        public CarRentalService(AppDbContext context)
        {
            _context = context;
        }
        public List<CarRental> List()
        {
            return _context.CarRentals.ToList();
        }
    }
}
