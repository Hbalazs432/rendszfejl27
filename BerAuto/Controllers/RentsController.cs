using BerAuto.DataContext.Dtos;
using BerAuto.DataContext.Entities;
using BerAuto.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BerAuto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RentsController : ControllerBase
    {
        private readonly IRentService _rentService;

        public RentsController(IRentService rentService)
        {
            _rentService = rentService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateRent([FromBody] RentCreateDto rentCreateDto)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(u => u.Type == ClaimTypes.NameIdentifier).Value);
                var res = await _rentService.CreateRentAsync(rentCreateDto, userId);
                return Ok(res);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpPost("anonym")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateRentAnonymus([FromBody] RentCreateDto rentCreateDto)
        {
            try
            {
                var res = await _rentService.CreateRentAsync(rentCreateDto, null);
                return Ok(res);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpPut("accept-rent/{rentId}")]
        [Authorize(Roles = "Clerk")]
        public async Task<IActionResult> Accept(int rentId)
        {
            try
            {
                var result = await _rentService.AcceptRentAsync(rentId);
                return Ok();
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }


        [HttpPut("decline-rent/{rentId}")]
        [Authorize(Roles = "Clerk")]
        public async Task<IActionResult> Decline(int rentId)
        {
            try
            {
                var result = await _rentService.DeclineRentAsync(rentId);
                return Ok();
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpPut("finish-rent/{rentId}")]
        [Authorize(Roles = "Clerk")]
        public async Task<IActionResult> Finish(int rentId)
        {
            try
            {
                var result = await _rentService.FinishRentAsync(rentId);
                return Ok();
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpGet("previous-rents")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> ListPreviousRents()
        {
            try
            {
                var userId = int.Parse(User.Claims.First(u => u.Type == ClaimTypes.NameIdentifier).Value);
                var result = await _rentService.GetPreviousRents(userId);
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }

        }

        [HttpGet("accepted-rents")]
        [Authorize(Roles = "Clerk")]
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
        [Authorize(Roles = "Clerk")]
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
        [Authorize(Roles = "Clerk")]
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

        [HttpGet("declined-rents")]
        [Authorize(Roles = "Clerk")]
        public async Task<IActionResult> ListDeclinedRents()
        {
            try
            {
                var result = await _rentService.GetDeclinedRents();
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpGet("user-rents/{userId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> ListUserRents()
        {
            try
            {
                var userId = int.Parse(User.Claims.First(u => u.Type == ClaimTypes.NameIdentifier).Value);
                var result = await _rentService.GetRentsByUser(userId);
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }
    }
}
