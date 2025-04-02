using BerAuto.DataContext.Context;
using BerAuto.DataContext.Entities;
using BerAuto.DataContext.Dtos;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace BerAuto.Services
{
    public interface ICarService
    {
        Task<IList<CarDto>> GetAllCarsAsync();
        Task<CarDto> GetCarByIdAsync(int idx);
        Task<CarDto> CreateCarAsync(CarCreateDto car);
        Task<CarDto> UpdateCarAsync(int id, CarUpdateDto car);

        Task<CarCategoryDto> CreateCarCategoryAsync(CarCategoryCreateDto categoryDto);
        Task<IList<CarCategoryDto>> GetAllCarCategoriesAsync();
        Task<CarCategoryDto> UpdateCarCategoryAsync(int categoryId, CarCategoryUpdateDto categoryDto);
        Task<IList<CarDto>> GetAvailableCarsAsync();
        Task<bool> ChangeStatusRented(int carId);
        Task<bool> ChangeStatusWithCustomer(int carId);
        Task<bool> ChangeStatusAvailable(int carId);
        Task<bool> DeleteCar(int carId);

    }
    public class CarService : ICarService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public CarService(AppDbContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<IList<CarDto>> GetAllCarsAsync()
        {
            var cars = await _context.Cars.Include(c =>c.CarCategory).ToListAsync();
            return _mapper.Map<IList<CarDto>>(cars);
        }

        public async Task<IList<CarDto>> GetAvailableCarsAsync()
        {
            var cars = await _context.Cars.Include(c => c.CarCategory).
                Where(c => c.Status == Status.Available).ToListAsync();
            return _mapper.Map<IList<CarDto>>(cars);
        }

        public async Task<CarDto> GetCarByIdAsync(int idx)
        {
            var car = await _context.Cars.Include(c => c.CarCategory).FirstOrDefaultAsync(c => c.Id == idx);
            return _mapper.Map<CarDto>(car);
        }
        public async Task<CarDto> CreateCarAsync(CarCreateDto car)
        {
            var res = _mapper.Map<Car>(car);
            res.Status = Status.Available;
            await _context.Cars.AddAsync(res);
            await _context.SaveChangesAsync();
            return _mapper.Map<CarDto>(res);
        }
        public async Task<CarDto> UpdateCarAsync(int id, CarUpdateDto carDto)
        {
            var car = await _context.Cars.FirstOrDefaultAsync(c=>c.Id==id);
            if (car == null)
            {
                throw new KeyNotFoundException("Car not found.");
            }
            _mapper.Map(carDto,car);
            _context.Cars.Update(car);
            await _context.SaveChangesAsync();
            return _mapper.Map<CarDto>(car);
        }

        public async Task<CarCategoryDto> CreateCarCategoryAsync(CarCategoryCreateDto categoryDto)
        {
            var carCategory = _mapper.Map<CarCategory>(categoryDto);
            await _context.CarCategories.AddAsync(carCategory);
            await _context.SaveChangesAsync();
            return _mapper.Map<CarCategoryDto>(carCategory);
        }

        public async Task<IList<CarCategoryDto>> GetAllCarCategoriesAsync()
        {
            var categories = await _context.CarCategories.ToListAsync();
            return _mapper.Map<IList<CarCategoryDto>>(categories);
        }

        public async Task<CarCategoryDto> UpdateCarCategoryAsync(int categoryId, CarCategoryUpdateDto categoryDto)
        {
            var category = await _context.CarCategories.FirstOrDefaultAsync(c => c.Id == categoryId);
            if (category == null) 
            {
                throw new KeyNotFoundException("Category not found.");
            }
            _mapper.Map(categoryDto, category);
            _context.CarCategories.Update(category);
            await _context.SaveChangesAsync();
            return _mapper.Map<CarCategoryDto>(category);
        }

        public async Task<bool> ChangeStatusRented(int carId)
        {
            var car = await _context.Cars.FirstOrDefaultAsync(o => o.Id == carId && o.Status == Status.Available);
            if (car is null)
            {
                throw new Exception("Car not found");
            }
            car.Status = Status.Rented;
            _context.Cars.Update(car);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> ChangeStatusWithCustomer(int carId)
        {
            var car = await _context.Cars.FirstOrDefaultAsync(o => o.Id == carId && o.Status == Status.Rented);
            if (car is null)
            {
                throw new Exception("Car not found");
            }
            car.Status = Status.WithCustomer;
            _context.Cars.Update(car);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> ChangeStatusAvailable(int carId)
        {
            var car = await _context.Cars.FirstOrDefaultAsync(o => o.Id == carId && o.Status == Status.WithCustomer);
            if (car is null)
            {
                throw new Exception("Car not found");
            }
            car.Status = Status.Available;
            _context.Cars.Update(car);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> DeleteCar(int carId)
        {
            var car = await _context.Cars.FirstOrDefaultAsync(c => c.Id == carId && c.Status == Status.Available);
            if (car == null)
            {
                throw new Exception("Car not found");
            }
            _context.Cars.Remove(car);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }
    }
}
