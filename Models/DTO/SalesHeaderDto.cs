using System.ComponentModel.DataAnnotations;

namespace Uzser.CoreServices.Models.DTO
{
    public class SalesHeaderDto
    {
        [Key]
        public int Id { get; set; }

        public string? UserId { get; set; } // Kullanıcı ID'si
        public DateTime CreateDate { get; set; } = DateTime.Now;
        public DateTime UpdateDate { get; set; } = DateTime.Now;
        public byte? WFState { get; set; }
        public int FlowId { get; set; }

        public int MasterId { get; set; }

        public string? OrderNumber { get; set; } = string.Empty;

        public string? SalesManCode { get; set; } = string.Empty;

        public string CustomerCode { get; set; } = string.Empty;

        public string? LicensePlate { get; set; } = string.Empty;

        public DateTime OrderDate { get; set; }

        public DateTime DeliveryDate { get; set; }

        public string? Description { get; set; } = string.Empty;

        public string? Description2 { get; set; } = string.Empty;

        public float? DiscountRate { get; set; } = 0;

        public int Status { get; set; } = 0;



    }
}
