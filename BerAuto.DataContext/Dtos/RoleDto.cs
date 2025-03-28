using BerAuto.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BerAuto.DataContext.Dtos
{
    public class RoleDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class RoleCreateDto
    {
        [Required]
        public string Name { get; set; }
    }
    public class RoleUpdateDto
    {
        [Required]
        public string Name { get; set; }
    }

}
