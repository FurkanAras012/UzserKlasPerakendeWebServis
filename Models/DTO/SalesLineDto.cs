using System.ComponentModel.DataAnnotations;

namespace Uzser.CoreServices.Models.DTO
{
    public class SalesLineDto  
    {
        [Key]
        public int Id { get; set; }

        public string? UserId { get; set; } // Kullanıcı ID'si
        public DateTime? CreateDate { get; set; }
        public DateTime? UpdateDate { get; set; }
        public byte? WFState { get; set; }
        public int? MasterId { get; set; }

        public int FlowId { get; set; }
        public string? StockCode { get; set; }

        public int UnitId { get; set; } = -1; // Birim ID'si, varsayılan -1

        public float? Amount { get; set; } = 0;
        public float? Price { get; set; } = 0;
        public float? DiscountRate { get; set; } = 0;

        public int CurrencyId { get; set; } = -1;

        public string? Description { get; set; } = string.Empty;


      

    }
}