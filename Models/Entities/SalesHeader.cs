using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uzser.CoreServices.Models.Entities
{
    [Table("UZS_TBL_SATIS_MAS")]
    public class SalesHeader
    {
        [Key]
        public int Id { get; set; }

        public string? CreateUser { get; set; }
        public string? UpdateUser { get; set; }
        public DateTime CreateDate { get; set; } =DateTime.Now;
        public DateTime UpdateDate { get; set; } = DateTime.Now;
        public byte? WFState { get; set; }
        public int FlowId { get; set; }
        public string? OrderNumber { get; set; } = string.Empty;

        public string? SalesManCode { get; set; } = string.Empty;

        public string CustomerCode { get; set; } = string.Empty;

        public string? LicensePlate { get; set; } = string.Empty;

        public DateTime OrderDate { get; set; }

        public DateTime DeliveryDate { get; set; }

        public string? Description { get; set; } = string.Empty;

        public string? Description2 { get; set; } = string.Empty;

        public float? DiscountRate { get; set; } = 0;



    }
}