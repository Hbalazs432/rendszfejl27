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

    public enum Status
    {
        Available,
        Rented,
        WithCustomer
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
        public int Distance { get; set; }
        public double Consumption { get; set; }
        public double Capacity { get; set; }
        public int CarCategoryId { get; set; }
        public CarCategory CarCategory { get; set; }
        public Engine Engine { get; set; }
        public double Price { get; set; }
        public Status Status { get; set; }
    }
}
