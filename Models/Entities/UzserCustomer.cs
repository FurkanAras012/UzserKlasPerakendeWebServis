using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uzser.CoreServices.Models.Entities
{
    [Table("UZS_TBL_CUSTOMER")]
    public class UzserCustomer
    {

        [Key]
        public int Id { get; set; }
        public DateTime? CreateDate { get; set; }
        public string? CreateUser { get; set; } = string.Empty;
        public DateTime? UpdateDate { get; set; }
        public string? UpdateUser { get; set; } = string.Empty;
        public int? WFState { get; set; } = 0;
        public string? CustomerCode { get; set; } = string.Empty;
        public string? CustomerName { get; set; } = string.Empty;
        public string? VknTc { get; set; } = string.Empty;
        public string? TaxOffice { get; set; } = string.Empty;
        public string? Address { get; set; } = string.Empty;
        public string? Telephone { get; set; } = string.Empty;
        public int? PaymentType { get; set; } = -1;
        public string? Email { get; set; } = string.Empty;
        public int? FlowId { get; set; } = 0;
    }
}