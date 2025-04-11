using BerAuto.DataContext.Dtos;
using BerAuto.DataContext.Entities;
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
            try
            {
                var res = await _rentService.CreateRentAsync(rentCreateDto, rentCreateDto.UserId);
                return Ok(res);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }  
        }

        [HttpPut("accept-rent/{orderId}")]
        public async Task<IActionResult> Accept(int orderId)
        {
            try
            {
                var result = await _rentService.AcceptRentAsync(orderId);
                return Ok();
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpGet("previous-rents/{userId}")]
        public async Task<IActionResult> ListPreviousRents(int userId)
        {
            try
            {
                var result = await _rentService.GetPreviousRents(userId);
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
            
        }

        [HttpGet("accepted-rents")]
        public async Task<IActionResult> ListAcceptedRents()
        {
            try
            {
                var result = await _rentService.GetAcceptedRents();
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpGet("finished-rents")]
        public async Task<IActionResult> ListFinishedRents()
        {
            try
            {
                var result = await _rentService.GetFinishedRents();
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpGet("pending-rents")]
        public async Task<IActionResult> ListPendingRents()
        {
            try
            {
                var result = await _rentService.GetPendingRents();
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }
    }
}
