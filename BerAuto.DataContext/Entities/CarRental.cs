using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BerAuto.DataContext.Entities
{
    public class CarRental
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int AddressId { get; set; }
        public Address Address { get; set; }
        public List<Car> Cars { get; set; }
        public List<Rent> Rents { get; set; }
        public List<User> Staff { get; set; }
    }
}
