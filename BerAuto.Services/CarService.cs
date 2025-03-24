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
        List<Car> GetAllCars();
        Car GetCarById(int idx);

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
        public List<Car> GetAllCars()
        {
            return _context.Cars.ToList();
        }

        public Car GetCarById(int idx)
        {
            return _context.Cars.Find(idx);
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
