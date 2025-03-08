using BerAuto.DataContext.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BerAuto.DataContext.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<CarCategory> CarCategories { get; set; }
        public DbSet<CarRental> CarRentals { get; set; }
        public DbSet<Rent> Rents { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }

    }
}
