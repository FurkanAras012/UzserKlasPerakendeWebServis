using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
namespace Uzser.CoreServices.Models.Entities
{
    [Table("UZS_VW_STOCK")]
    public class Stock
    {
        [Key]
        public string STOCK_CODE { get; set; } = string.Empty;
        public string STOCK_NAME { get; set; } = string.Empty;
    }
}