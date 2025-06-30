using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uzser.CoreServices.Models.Entities
{
    [Table("UZS_TBL_ORDER_SERIES")]
    public class OrderSeries
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(10)]
        public string SeriesCode { get; set; } = string.Empty; // Örn: "ABC", "DEF"

        [Required]
        [MaxLength(50)]
        public string SeriesName { get; set; } = string.Empty; // Açıklama

        public int CurrentNumber { get; set; } = 0; // Son kullanılan numara

        [MaxLength(15)]
        public string? LastOrderNumber { get; set; } = string.Empty; // Son oluşturulan sipariş no

        public DateTime CreateDate { get; set; } = DateTime.Now;
        public DateTime UpdateDate { get; set; } = DateTime.Now;
        public string? CreateUser { get; set; }
        public string? UpdateUser { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
