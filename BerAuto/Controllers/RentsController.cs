using BerAuto.DataContext.Dtos;
using BerAuto.Services;
using Microsoft.AspNetCore.Mvc;

namespace BerAuto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentsController : ControllerBase
    {
        private readonly IRentService _rentService;

        public RentsController(IRentService rentService) 
        {
            _rentService = rentService;
        }

        [HttpPost("create-rent")]
        public async Task<IActionResult> CreateRent([FromBody] RentCreateDto rentCreateDto)
        {
            var res = await _rentService.CreateRentAsync(rentCreateDto, rentCreateDto.UserId);
            return Ok(res);
        }

        [HttpPut("accept-rent/{orderId}")]
        public async Task<IActionResult> Accept(int orderId)
        {
            var result = await _rentService.AcceptRentAsync(orderId);
            if (!result)
            {
                throw new Exception("Couldn't accept the rent request");
            }
            return Ok();
        }

        [HttpGet("previous-rents/{userId}")]
        public async Task<IActionResult> ListPreviousRents(int userId)
        {
            var result = await _rentService.GetPreviousRents(userId);
            return Ok(result);
        }

        [HttpGet("accepted-rents")]
        public async Task<IActionResult> ListAcceptedRents()
        {
            var result = await _rentService.GetAcceptedRents();
            return Ok(result);
        }

        [HttpGet("finished-rents")]
        public async Task<IActionResult> ListFinishedRents()
        {
            var result = await _rentService.GetFinishedRents();
            return Ok(result);
        }

        [HttpGet("pending-rents")]
        public async Task<IActionResult> ListPendingRents()
        {
            var result = await _rentService.GetPendingRents();
            return Ok(result);
        }
    }
}
