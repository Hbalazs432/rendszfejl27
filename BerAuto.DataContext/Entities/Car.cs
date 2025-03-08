using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BerAuto.DataContext.Entities
{
    public enum Transmission
    {
        Manual,
        Automatic
    }

    public enum Engine
    {
        Diesel,
        Electronic
    }
    public class Car
    {
        public int Id { get; set; }
        public string LicensePlateNumber { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public int YearOfManufacture { get; set; }
        public int Seats { get; set; }
        public Transmission Transmission { get; set; }
        public List<int>? Ratings { get; set;}
        public int Distance { get; set; }
        public double Consumption { get; set; }
        public double Capacity { get; set; }
        public int? CarRentalId { get; set; }
        public CarRental CarRental { get; set; }
        public int CarCategoryId { get; set; }
        public CarCategory CarCategory { get; set; }
        public Engine Engine { get; set; }
        public int Price { get; set; }
    }
}
