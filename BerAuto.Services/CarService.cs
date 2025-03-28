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
        Task<IList<CarDto>> GetAllCars();
        Task<CarDto> GetCarById(int idx);
        Task<CarDto> CreateCar(CarCreateDto car);
        Task<CarDto> UpdateCar(int id, CarUpdateDto car);

        Task<CarCategoryDto> CreateCarCategoryAsync(CreateCarCategoryDto categoryDto);
        Task<IList<CarCategoryDto>> GetAllCarCategoriesAsync();
        Task<CarCategoryDto> UpdateCarCategoryAsync(int categoryId, string categoryName);

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
        public async Task<IList<CarDto>> GetAllCars()
        {
            var cars = await _context.Cars.Include(c =>c.CarCategory).ToListAsync();
            return _mapper.Map<IList<CarDto>>(cars);
        }

        public async Task<CarDto> GetCarById(int idx)
        {
            var car = await _context.Cars.Include(c => c.CarCategory).FirstOrDefaultAsync(c => c.Id == idx);
            return _mapper.Map<CarDto>(car);
        }
        public async Task<CarDto> CreateCar(CarCreateDto car)
        {
            var res = _mapper.Map<Car>(car);
            await _context.Cars.AddAsync(res);
            await _context.SaveChangesAsync();
            return _mapper.Map<CarDto>(res);
        }
        public async Task<CarDto> UpdateCar(int id, CarUpdateDto carDto)
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

        public async Task<CarCategoryDto> CreateCarCategoryAsync(CreateCarCategoryDto categoryDto)
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

        public async Task<CarCategoryDto> UpdateCarCategoryAsync(int categoryId, string categoryName)
        {
            var category = await _context.CarCategories.FirstOrDefaultAsync(c => c.Id == categoryId);
            if (category == null) 
            {
                throw new KeyNotFoundException("Category not found.");
            }
            category.Name = categoryName;
            _context.CarCategories.Update(category);
            await _context.SaveChangesAsync();
            return _mapper.Map<CarCategoryDto>(category);
        }
    }
}
