﻿using BerAuto.DataContext.Context;
using BerAuto.DataContext.Entities;
using BerAuto.DataContext.Dtos;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Globalization;
using System.Text.RegularExpressions;


namespace BerAuto.Services
{
    public interface IUserService
    {
        Task<RoleDto> CreateRoleAsync(RoleCreateDto roleCreateDto);
        Task<RoleDto> UpdateRoleAsync(int id, RoleUpdateDto roleUpdateDto);

        Task<bool> DeleteRoleAsync(int id);
        Task<IList<RoleDto>> GetAllRolesAsync();

        Task<UserDto> RegisterUserAsync(UserCreateDto userCreateDto);
        Task<string> LoginAsync(UserLoginDto userLoginDto);
        Task<UserDto> UpdateProfileAsync(int id, UserUpdateDto userUpdateDto);
        Task<UserDto> UpdateAddressAsync(int id, AddressCreateDto addressCreateDto);
        Task<UserDto> UpdatePhoneAsync(int id, UpdatePhoneDto updatePhoneDto);
        Task<UserDto> GetUserAsync(int id);
    }

    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public UserService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<RoleDto> CreateRoleAsync(RoleCreateDto roleCreateDto)
        {
            var role = _mapper.Map<Role>(roleCreateDto);
            await _context.Roles.AddAsync(role);
            await _context.SaveChangesAsync();
            return _mapper.Map<RoleDto>(role);
        }
        public async Task<RoleDto> UpdateRoleAsync(int roleId, RoleUpdateDto roleUpdateDto)
        {
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Id == roleId);
            if (role is null)
            {
                throw new KeyNotFoundException($"No role found with id: {roleId}");
            }
            _mapper.Map(roleUpdateDto, role);
            _context.Roles.Update(role);
            await _context.SaveChangesAsync();
            return _mapper.Map<RoleDto>(role);
        }
        public async Task<IList<RoleDto>> GetAllRolesAsync()
        {
            var roles = await _context.Roles.ToListAsync();
            return _mapper.Map<IList<RoleDto>>(roles);
        }

        private async Task<Role> GetDefaultCustomerRoleAsync()
        {
            var customerRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Customer");
            if (customerRole == null)
            {
                customerRole = new Role { Name = "Customer" };
                await _context.Roles.AddAsync(customerRole);
                await _context.SaveChangesAsync();
            }
            return customerRole;
        }

        public async Task<UserDto> RegisterUserAsync(UserCreateDto userCreateDto)
        {

            if (!IsValidEmail(userCreateDto.Email)) throw new Exception("Invalid e-mail address.");
            //if (userCreateDto.Address.PostalCode == "") throw new Exception("Postal Code is required.");
            //if (userCreateDto.Address.Street == "") throw new Exception("Street is required.");
            //if (userCreateDto.Address.City == "") throw new Exception("City is required.");

            var user = _mapper.Map<User>(userCreateDto);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userCreateDto.PasswordHash);
            user.Roles = new List<Role>();
            if (!user.Roles.Any())
            {
                user.Roles.Add(await GetDefaultCustomerRoleAsync());
            }

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return _mapper.Map<UserDto>(user);
        }
        public async Task<string> LoginAsync(UserLoginDto userLoginDto)
        {
            var user = await _context.Users
                .Include(u => u.Roles)
                .FirstOrDefaultAsync(u => u.Email == userLoginDto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(userLoginDto.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid credentials.");
            }

            return await GenerateToken(user);
        }

        private async Task<string> GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ME2nCqWZ0JkT0VLQaq3PLgWElyVOpmMd"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(5));
            var id = await GetClaimsIdentity(user);
            var token = new JwtSecurityToken(issuer: "https://localhost:7175/", audience: "http://localhost:5173/", id.Claims, expires: expires, signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private async Task<ClaimsIdentity> GetClaimsIdentity(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Sid, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.AuthTime, DateTime.Now.ToString(CultureInfo.InvariantCulture))
            };

            if (user.Roles != null && user.Roles.Any())
            {
                claims.AddRange(user.Roles.Select(role => new Claim("roleIds", Convert.ToString(role.Id))));
                claims.AddRange(user.Roles.Select(role => new Claim(ClaimTypes.Role, role.Name)));
            }

            return new ClaimsIdentity(claims, "Token");
        }

        public async Task<UserDto> UpdateProfileAsync(int id, UserUpdateDto userUpdateDto)
        {
            var user = await _context.Users.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Id == id);
            if (user is null)
            {
                throw new KeyNotFoundException($"No user found with id: {id}");
            }
            _mapper.Map(userUpdateDto, user);
            if (userUpdateDto.RoleIds != null && userUpdateDto.RoleIds.Any())
            {
                user.Roles.Clear();
                foreach (var RoleId in userUpdateDto.RoleIds)
                {
                    var existingRole = await _context.Roles.FirstOrDefaultAsync(r => r.Id == RoleId);
                    if (existingRole != null)
                    {
                        user.Roles.Add(existingRole);
                    }
                }
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> UpdateAddressAsync(int id, AddressCreateDto addressCreateDto)
        {
            var user = await _context.Users.Include(u => u.Address).FirstOrDefaultAsync(u => u.Id == id);
            if (user is null)
            {
                throw new KeyNotFoundException($"No user found with id: {id}");
            }
            user.Address = _mapper.Map<Address>(addressCreateDto);
            _context.Users.Update(user);

            await _context.SaveChangesAsync();

            return _mapper.Map<UserDto>(user);
        }
        public async Task<UserDto> UpdatePhoneAsync(int id, UpdatePhoneDto updatePhoneDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user is null)
            {
                throw new KeyNotFoundException($"No user found with id: {id}");
            }
            user.Phone = updatePhoneDto.Phone;
            _context.Users.Update(user);

            await _context.SaveChangesAsync();

            return _mapper.Map<UserDto>(user);
        }
        public async Task<UserDto> GetUserAsync(int id)
        {
            var user = await _context.Users.Include(u => u.Address).Include(u => u.Roles).FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                throw new KeyNotFoundException($"No user found with id: {id}");
            }
            return _mapper.Map<UserDto>(user);
        }

        public async Task<bool> DeleteRoleAsync(int id)
        {
            var role = await _context.Roles.FindAsync(id);

            if (role == null)
                throw new KeyNotFoundException($"No role found with id: {id}");

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();
            return true;
        }

        private static bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            try
            {
                // Normalize the domain
                email = Regex.Replace(email, @"(@)(.+)$", DomainMapper,
                                      RegexOptions.None, TimeSpan.FromMilliseconds(200));

                // Examines the domain part of the email and normalizes it.
                string DomainMapper(Match match)
                {
                    // Use IdnMapping class to convert Unicode domain names.
                    var idn = new IdnMapping();

                    // Pull out and process domain name (throws ArgumentException on invalid)
                    string domainName = idn.GetAscii(match.Groups[2].Value);

                    return match.Groups[1].Value + domainName;
                }
            }
            catch (RegexMatchTimeoutException e)
            {
                return false;
            }
            catch (ArgumentException e)
            {
                return false;
            }

            try
            {
                return Regex.IsMatch(email,
                    @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                    RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
        }
    }
}
