using BerAuto.DataContext.Context;
using BerAuto.DataContext.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BerAuto.Services
{
    public interface ICarService
    {
        List<Car> GetAllCars();
        Car GetCarById(int idx);
    }
    public class CarService : ICarService
    {
        private readonly AppDbContext _context;
        public CarService(AppDbContext context)
        {
            _context = context;
        }
        public List<Car> GetAllCars()
        {
            return _context.Cars.ToList();
        }

        public Car GetCarById(int idx)
        {
            return _context.Cars.Find(idx);
        }
    }
}
