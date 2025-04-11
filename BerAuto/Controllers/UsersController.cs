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
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }


        [HttpPost("create-role")]
        public async Task<IActionResult> CreateRole(RoleCreateDto roleCreateDto)
        {
            try
            {
                var resesult = await _userService.CreateRoleAsync(roleCreateDto);
                return Ok(resesult);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }   
        }

        [HttpPut("update-role-{id}")]
        public async Task<IActionResult> UpdateRole(int id, RoleUpdateDto roleUpdateDto)
        {
            try
            {
                var result = await _userService.UpdateRoleAsync(id, roleUpdateDto);
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpDelete("delete-role-{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            try
            {
                var result = await _userService.DeleteRoleAsync(id);

                if (result)
                    return NoContent();

            }
            catch(Exception exc)
            {
                return NotFound();
            }

            return NotFound();
        }

        [HttpGet("roles")]
        public async Task<IActionResult> ListRoles()
        {
            try
            {
                var result = await _userService.GetAllRolesAsync();
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserCreateDto userCreateDto)
        {
            try
            {
                var result = await _userService.RegisterUserAsync(userCreateDto);
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
        {
            var token = await _userService.LoginAsync(userLoginDto);
            return Ok(new { Token = token });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id,UserUpdateDto userUpdateDto)
        {
            try
            {
                var result = await _userService.UpdateProfileAsync(id, userUpdateDto);
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }
        [HttpPut("update-address-{id}")]
        public async Task<IActionResult> UpdateAddress(int id, AddressCreateDto addressCreateDto)
        { 
            try
            {
                var result = await _userService.UpdateAddressAsync(id, addressCreateDto);
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpPut("update-phone-{id}")]
        public async Task<IActionResult> UpdatePhone(int id, [FromBody] UpdatePhoneDto updatePhoneDto)
        {
            try
            {
                var result = await _userService.UpdatePhoneAsync(id, updatePhoneDto);
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpGet("/{id}")]
        public async Task<IActionResult> GetUser(int id)
        { 
            try
            {
                var result = await _userService.GetUserAsync(id);
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }
    }
}
