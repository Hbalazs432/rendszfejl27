using BerAuto.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace BerAuto.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class CarRentalController : ControllerBase
    {
        private readonly ICarRentalService _carRentalService;

        public CarRentalController(ICarRentalService carRentalService)
        {
            _carRentalService = carRentalService;
        }



        [HttpGet]
        public IActionResult List()
        {
            var result = _carRentalService.List();

            return Ok(result);
        }
    }
}
