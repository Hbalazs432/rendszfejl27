using BerAuto.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BerAuto.DataContext.Dtos
{
    public class RentDto
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string Email { get; set; }
        public int? AddressId { get; set; }
        public RentStatus RentStatus { get; set; }
        public int? CarId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }

        public CarDto Car { get; set; }
    }

    public class RentCreateDto
    {
        public int? CarId { get; set; }
        public string? Email { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
