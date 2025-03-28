using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BerAuto.DataContext.Dtos
{
    public class CarCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class CarCategoryCreateDto
    {
        [Required]
        public string Name { get; set; }
    }
    public class CarCategoryUpdateDto
    {
        [Required]
        public string Name { get; set; }
    }
}
