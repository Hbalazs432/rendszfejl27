using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BerAuto.DataContext.Context;
using BerAuto.DataContext.Entities;
using BerAuto.Services;
using BerAuto.DataContext.Dtos;

namespace BerAuto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        private readonly ICarService _carService;

        public CarsController(ICarService carService)
        {
            _carService = carService;
        }

        [HttpGet]
        public IActionResult List()
        {
            var result = _carService.GetAllCars();

            return Ok(result);
        }

        [HttpGet("{idx}")]
        public IActionResult GetCar(int idx)
        {
            var result = _carService.GetCarById(idx);
            if (result is null) return BadRequest("No such car");

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCarCategory([FromBody] CreateCarCategoryDto carCategoryDto)
        {
            var category = await _carService.CreateCarCategoryAsync(carCategoryDto);
            return Ok();
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetAllCarCategories()
        {
            var categories = await _carService.GetAllCarCategoriesAsync();
            return Ok(categories);
        }

        [HttpPut("update-car-categories/{categoryId}")]
        public async Task<IActionResult> UpdateCategory(int categoryId, string categoryName)
        {
            var result = await _carService.UpdateCarCategoryAsync(categoryId,categoryName);
            return Ok(result);
        }
    }
}
