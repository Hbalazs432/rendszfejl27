using BerAuto.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BerAuto.DataContext.Dtos
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public Address Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public IList<RoleDto> Role { get; set; }
    }

    public class UserCreateDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public Address Address { get; set; }
        public string PhoneNumber { get; set; }
    }

    public class UserUpdateDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public Address Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
    }

    public class UserLoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
