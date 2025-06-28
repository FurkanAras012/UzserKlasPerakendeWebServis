using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uzser.CoreServices.Models.Entities
{
    [Table("UZS_TBL_SATIS_TRA")]
    public class SalesLine  
    {
        [Key]
        public int Id { get; set; }

        public string? CreateUser { get; set; }
        public string? UpdateUser { get; set; }
        public DateTime? CreateDate { get; set; }
        public DateTime? UpdateDate { get; set; }
        public byte? WFState { get; set; }
        public int? MasterId { get; set; }

        public int FlowId { get; set; }
        public string? StockCode { get; set; }

        public int UnitId { get; set; } = -1; 

        public float? Amount { get; set; } = 0;
        public float? Price { get; set; } = 0;
        public float? DiscountRate { get; set; } = 0;

        public int CurrencyId { get; set; } = -1;

        public string? Description { get; set; } = string.Empty;


      

    }
}