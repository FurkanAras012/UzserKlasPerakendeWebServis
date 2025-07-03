using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uzser.CoreServices.Models.Entities
{
    [Table("UZS_VW_CUSTOMER")]
    public class Customer
    {



        public DateTime? CREATEDATE { get; set; }
        public string? CREATEUSER { get; set; } = string.Empty;
        public DateTime? UPDATEDATE { get; set; }
        public string? UPDATEUSER { get; set; } = string.Empty;
        public int? WFSTATE { get; set; } = 0;
        public string? CUSTOMERCODE { get; set; } = string.Empty;
        public string? CUSTOMERNAME { get; set; } = string.Empty;
        public string? VKNTC { get; set; } = string.Empty;
        public string? TAXOFFICE { get; set; } = string.Empty;
        public string? ADDRESS { get; set; } = string.Empty;
        public string? TELEPHONE { get; set; } = string.Empty;
        public int? PAYMENTTYPE { get; set; } = -1;
        public string? EMAIL { get; set; } = string.Empty;
        public int? FLOWID { get; set; } = 0;
        
         public int? STATUS { get; set; } = 0;
    }
}