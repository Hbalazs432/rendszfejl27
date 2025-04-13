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
using System.Security.Claims;

namespace BerAuto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }


        [HttpPost("create-role")]
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            try
            {
                var result = await _userService.DeleteRoleAsync(id);

                return Ok();

            }
            catch(Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpGet("roles")]
        [Authorize(Roles = "Admin")]
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
        [AllowAnonymous]
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
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
        {
            try
            {
                var token = await _userService.LoginAsync(userLoginDto);
                return Ok(new { Token = token });
            }catch(Exception exc)
            {
                return BadRequest(exc.Message);
            }
            
        }

        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile(UserUpdateDto userUpdateDto)
        {
            try
            {
                var id = int.Parse(User.Claims.First(u => u.Type == ClaimTypes.NameIdentifier).Value);
                var result = await _userService.UpdateProfileAsync(id, userUpdateDto);
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }
        [HttpPut("update-address")]
        public async Task<IActionResult> UpdateAddress(AddressCreateDto addressCreateDto)
        { 
            try
            {
                var id = int.Parse(User.Claims.First(u => u.Type == ClaimTypes.NameIdentifier).Value);
                var result = await _userService.UpdateAddressAsync(id, addressCreateDto);
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpPut("update-phone")]
        public async Task<IActionResult> UpdatePhone([FromBody] UpdatePhoneDto updatePhoneDto)
        {
            try
            {
                var id = int.Parse(User.Claims.First(u => u.Type == ClaimTypes.NameIdentifier).Value);
                var result = await _userService.UpdatePhoneAsync(id, updatePhoneDto);
                return Ok(result);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
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
