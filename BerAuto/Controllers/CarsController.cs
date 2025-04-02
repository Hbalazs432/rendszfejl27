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
        public async Task<IActionResult> List()
        {
            var result = await _carService.GetAllCarsAsync();

            return Ok(result);
        }

        [HttpGet("list-available-cars")]
        public async Task<IActionResult> ListAvailableCars()
        {
            var result = await _carService.GetAvailableCarsAsync();

            return Ok(result);
        }

        [HttpGet("{idx}")]
        public async Task<IActionResult> GetCar(int idx)
        {
            var result = await _carService.GetCarByIdAsync(idx);
            if (result is null) return BadRequest("No such car");

            return Ok(result);
        }
        [HttpPost("create-car")]
        public async Task<IActionResult> CreateCar([FromBody] CarCreateDto carCreateDto)
        {
            var car= await _carService.CreateCarAsync(carCreateDto);
            return Ok();
        }
        [HttpPut("update-car/{id}")]
        public async Task<IActionResult> UpdateCar(int id, [FromBody] CarUpdateDto carUpdateDto)
        { 
           var res = await _carService.UpdateCarAsync(id, carUpdateDto);
            return Ok(res);
        }
        [HttpPost("create-car-category")]
        public async Task<IActionResult> CreateCarCategory([FromBody] CarCategoryCreateDto carCategoryDto)
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
        public async Task<IActionResult> UpdateCategory(int categoryId, [FromBody] CarCategoryUpdateDto categoryDto)
        {
            var result = await _carService.UpdateCarCategoryAsync(categoryId, categoryDto);
            return Ok(result);
        }


        [HttpPut("change-status-rented/{carId}")]
        public async Task<IActionResult> ChangeStatusRented(int carId)
        {
            var result = await _carService.ChangeStatusRented(carId);
            if (!result)
            {
                throw new Exception("Couldn't change the car's status");
            }
            return Ok();
        }

        [HttpPut("change-status-withcustomer/{carId}")]
        public async Task<IActionResult> ChangeStatusWithCustomer(int carId)
        {
            var result = await _carService.ChangeStatusWithCustomer(carId);
            if (!result)
            {
                throw new Exception("Couldn't change the car's status");
            }
            return Ok();
        }

        [HttpPut("change-status-available/{carId}")]
        public async Task<IActionResult> ChangeStatusAvailable(int carId)
        {
            var result = await _carService.ChangeStatusAvailable(carId);
            if (!result)
            {
                throw new Exception("Couldn't change the car's status");
            }
            return Ok();
        }

        [HttpPut("delete-car/{carId}")]
        public async Task<IActionResult> DeleteCar(int carId)
        {
            var result = await _carService.DeleteCar(carId);
            if (!result)
            {
                throw new Exception("Couldn't delete the car");
            }
            return Ok();
        }
    }
}
