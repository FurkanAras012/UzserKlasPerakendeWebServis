using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uzser.CoreServices.Models.Entities
{
    [Table("UZS_VW_TIGERUSERS")]
    public class TigerUser
    {
        [Key]
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
    }
}
