using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BerAuto.DataContext.Entities
{
    public enum RentStatus
    {
        Pending,
        Accepted,
        Finished
    }
    public class Rent
    {
        public int Id { get; set; }
        public int AddressId { get; set; }
        public Address Address { get; set; }
        public int? UserId { get; set; }
        public User User { get; set; }
        public RentStatus RentStatus { get; set; }
        public int? CarId { get; set; }
        public Car Car { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public int? CarRentalId { get; set; }
        public CarRental CarRental { get; set; }
    }
}
