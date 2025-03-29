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
        public string Email { get; set; }
        public User? User { get; set; }
        public string RentStatus { get; set; }
        public string Car { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }

    public class RentCreateDto()
    {
        public int? CarId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
