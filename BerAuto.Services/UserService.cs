using BerAuto.DataContext.Context;
using BerAuto.DataContext.Entities;
using BerAuto.DataContext.Dtos;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;


namespace BerAuto.Services
{
    public interface IUserService
    {
        Task<RoleDto> CreateRoleAsync(RoleCreateDto roleCreateDto);
        Task<RoleDto> UpdateRoleAsync(int id,RoleUpdateDto roleUpdateDto);

        Task<bool> DeleteRoleAsync(int id);
        Task<IList<RoleDto>> GetAllRolesAsync();

        Task<UserDto> RegisterUserAsync(UserCreateDto userCreateDto);
        Task<UserDto> UpdateProfileAsync(int id,UserUpdateDto userUpdateDto);
        Task<UserDto> UpdateAddressAsync(int id, AddressCreateDto addressCreateDto);
        Task<UserDto> UpdatePhoneAsync(int id, UpdatePhoneDto updatePhoneDto);
        Task<UserDto> GetUserAsync(int id);
    }

    public class UserService:IUserService
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
        public async Task<RoleDto> UpdateRoleAsync(int id, RoleUpdateDto roleUpdateDto) 
        {
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Id == id);
            if (role == null)
            {
                throw new KeyNotFoundException("Role not found!");
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
            var user = _mapper.Map<User>(userCreateDto);   
            user.Roles=new List<Role>();
            if (!user.Roles.Any())
            {
                user.Roles.Add(await GetDefaultCustomerRoleAsync());
            }

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return _mapper.Map<UserDto>(user);
        }
        public async Task<UserDto> UpdateProfileAsync(int id, UserUpdateDto userUpdateDto)
        {
            var user = await _context.Users.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Id==id);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found!");
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
            var user= await _context.Users.Include(u => u.Address).FirstOrDefaultAsync(u => u.Id==id);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }
            user.Address= _mapper.Map<Address>(addressCreateDto);
            _context.Users.Update(user);    

            await _context.SaveChangesAsync();

            return _mapper.Map<UserDto>(user);
        }
        public async Task<UserDto> UpdatePhoneAsync(int id, UpdatePhoneDto updatePhoneDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }
            user.Phone = updatePhoneDto.Phone;
            _context.Users.Update(user);

            await _context.SaveChangesAsync();

            return _mapper.Map<UserDto>(user);
        }
        public async Task<UserDto> GetUserAsync(int id)
        {
            var user= await _context.Users.Include(u => u.Address).Include(u=>u.Roles).FirstOrDefaultAsync(u => u.Id==id);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found!");
            }
            return _mapper.Map<UserDto>(user);
        }

        public async Task<bool> DeleteRoleAsync(int id)
        {
            var role = await _context.Roles.FindAsync(id);

            if (role == null)
                throw new Exception("Role not found!");

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
