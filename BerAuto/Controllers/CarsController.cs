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
using Microsoft.AspNetCore.Authorization;

namespace BerAuto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CarsController : ControllerBase
    {
        private readonly ICarService _carService;

        public CarsController(ICarService carService)
        {
            _carService = carService;
        }

        [HttpGet]
        //[Authorize(Roles = "Admin")]??
        public async Task<IActionResult> List()
        {
            try
            {
                var result = await _carService.GetAllCarsAsync();
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpGet("list-available-cars")]
        [AllowAnonymous]
        public async Task<IActionResult> ListAvailableCars()
        {
            try
            {
                var result = await _carService.GetAvailableCarsAsync();
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpGet("{idx}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCar(int idx)
        {
            try
            {
                var result = await _carService.GetCarByIdAsync(idx);
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }
        [HttpPost("create-car")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCar([FromBody] CarCreateDto carCreateDto)
        {
            try
            {
                var car = await _carService.CreateCarAsync(carCreateDto);
                return Ok();
            }
            catch (Exception exc)
            {
                return BadRequest($"Creation failed. Error: {exc.Message}");
            }
        }
        [HttpPut("update-car/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCar(int id, [FromBody] CarUpdateDto carUpdateDto)
        {
            try
            {
                var result = await _carService.UpdateCarAsync(id, carUpdateDto);
                return Ok(result);
            }
            catch (Exception exc)
            {

                return BadRequest(exc.Message);
            }
        }
        [HttpPost("create-car-category")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCarCategory([FromBody] CarCategoryCreateDto carCategoryDto)
        {
            try
            {
                var category = await _carService.CreateCarCategoryAsync(carCategoryDto);
                return Ok();
            }
            catch (Exception exc)
            {
                return BadRequest($"Creation failed. Error: {exc.Message}");
            }
        }

        [HttpGet("categories")]
        //[Authorize(Roles = "Admin")]?
        public async Task<IActionResult> GetAllCarCategories()
        {
            try
            {
                var categories = await _carService.GetAllCarCategoriesAsync();
                return Ok(categories);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpPut("update-car-categories/{categoryId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory(int categoryId, [FromBody] CarCategoryUpdateDto categoryDto)
        {
            try
            {
                var result = await _carService.UpdateCarCategoryAsync(categoryId, categoryDto);
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }


        [HttpPut("change-status-rented/{carId}")]
        [Authorize(Roles = "Clerk")]
        public async Task<IActionResult> ChangeStatusRented(int carId)
        {
            try
            {
                var result = await _carService.ChangeStatusRented(carId);
                return Ok();
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpPut("change-status-withcustomer/{carId}")]
        [Authorize(Roles = "Clerk")]
        public async Task<IActionResult> ChangeStatusWithCustomer(int carId)
        {
            try
            {
                var result = await _carService.ChangeStatusWithCustomer(carId);
                return Ok();
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpPut("change-status-available/{carId}")]
        [Authorize(Roles = "Clerk")]
        public async Task<IActionResult> ChangeStatusAvailable(int carId)
        {
            try
            {
                var result = await _carService.ChangeStatusAvailable(carId);
                return Ok();
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpDelete("delete-car/{carId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCar(int carId)
        {
            try
            {
                var result = await _carService.DeleteCar(carId);
                return Ok();
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
            
        }
    }
}
