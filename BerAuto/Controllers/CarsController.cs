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

            return Ok(result);
        }
    }
}
