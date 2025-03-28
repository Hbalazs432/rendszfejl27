using BerAuto.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BerAuto.DataContext.Dtos
{
    public class CarDto
    {
        public int Id { get; set; }
        public string LicensePlateNumber { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public int YearOfManufacture { get; set; }
        public int Seats { get; set; }
        public string Transmission { get; set; }
        public int Distance { get; set; }
        public double Consumption { get; set; }
        public double Capacity { get; set; }
        public int CarCategoryId { get; set; }
        public CarCategoryDto CarCategory { get; set; }
        public string Engine { get; set; }
        public double Price { get; set; }
    }

    public class CarCreateDto
    { 
        public string LicensePlateNumber { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public int YearOfManufacture { get; set; }
        public int Seats { get; set; }
        public string Transmission { get; set; }
        public int Distance { get; set; }
        public double Consumption { get; set; }
        public double Capacity { get; set; }
        public int CarCategoryId { get; set; }
        public string Engine { get; set; }
        public double Price { get; set; }

    }
    public class CarUpdateDto
    {
        public string LicensePlateNumber { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public int YearOfManufacture { get; set; }
        public int Seats { get; set; }
        public string Transmission { get; set; }
        public int Distance { get; set; }
        public double Consumption { get; set; }
        public double Capacity { get; set; }
        public int CarCategoryId { get; set; }
        public string Engine { get; set; }
        public double Price { get; set; }
    }
}
