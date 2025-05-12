using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BerAuto.DataContext.Dtos
{
    public class InvoiceDto
    {
        public int RentId { get; set; }
        public string CustomerName { get; set; }
        public string Car { get; set; }
        public DateOnly StartDate  { get; set; }
        public DateOnly EndDate { get; set; }
        public DateOnly InvStartDate { get; set; }
        public DateOnly InvEndDate { get; set; }
        public int Days { get; set; }
        public double Price { get; set; }
        public double TotalAmount { get; set; }
    }
}
