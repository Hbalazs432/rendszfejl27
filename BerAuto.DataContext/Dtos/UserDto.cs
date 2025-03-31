using BerAuto.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        public AddressDto Address { get; set; }
        public string Phone { get; set; }
        public IList<RoleDto> Roles { get; set; }
    }

    public class UserCreateDto
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [MinLength(6)]
        public string PasswordHash { get; set; }
        //public string Password {get;set;} csak még nincs hash és csak így megy a regisztrálás
        [Required]
        public AddressCreateDto Address { get; set; }
        [Required]
        [Phone]
        public string Phone { get; set; }
    }

    public class UserUpdateDto
    {
        [StringLength(50)]
        public string Name { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        [Phone]
        public string Phone { get; set; }
        public IList<int> RoleIds { get; set; }
    }

    public class UserLoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }

    public class UpdatePhoneDto
    {
        public string Phone { get; set; }
    }
}
