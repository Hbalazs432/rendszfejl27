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
            var res=await _userService.CreateRoleAsync(roleCreateDto);
            return Ok(res);
        }

        [HttpPut("update-role-{id}")]
        public async Task<IActionResult> UpdateRole(int id, RoleUpdateDto roleUpdateDto)
        { 
            var res=await _userService.UpdateRoleAsync(id, roleUpdateDto);
            return Ok(res);
        }

        [HttpDelete("delete-role-{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            try
            {
                var res = await _userService.DeleteRoleAsync(id);

                if (res)
                    return NoContent();

            }
            catch(Exception ex)
            {
                return NotFound();
            }

            return NotFound();
        }

        [HttpGet("roles")]
        public async Task<IActionResult> ListRoles()
        { 
            var res=await _userService.GetAllRolesAsync();
            return Ok(res);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserCreateDto userCreateDto)
        {
            var res = await _userService.RegisterUserAsync(userCreateDto);
            return Ok(res);
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
            var res = await _userService.UpdateProfileAsync(id,userUpdateDto);
            return Ok(res);
        }
        [HttpPut("update-address-{id}")]
        public async Task<IActionResult> UpdateAddress(int id, AddressCreateDto addressCreateDto)
        { 
            var res=await _userService.UpdateAddressAsync(id,addressCreateDto);
            return Ok(res);
        }

        [HttpPut("update-phone-{id}")]
        public async Task<IActionResult> UpdatePhone(int id, [FromBody] UpdatePhoneDto updatePhoneDto)
        {
            var res = await _userService.UpdatePhoneAsync(id, updatePhoneDto);
            return Ok(res);
        }

        [HttpGet("/{id}")]
        public async Task<IActionResult> GetUser(int id)
        { 
            var res = await _userService.GetUserAsync(id);
            return Ok(res);
        }
    }
}
