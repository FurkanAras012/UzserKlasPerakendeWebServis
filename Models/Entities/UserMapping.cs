using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uzser.CoreServices.Models.Entities
{
    [Table("UZS_TBL_USER_MAPPING")]
    public class UserMapping
    {
        [Key]
        public int Id { get; set; }
        
        public string FlowUserId { get; set; } = string.Empty;
        public string FlowUserName { get; set; } = string.Empty;
        
        public int TigerUserId { get; set; }
        public string TigerUserName { get; set; } = string.Empty;
        
        public string? CreateUser { get; set; }
        public string? UpdateUser { get; set; }
        public DateTime CreateDate { get; set; } = DateTime.Now;
        public DateTime UpdateDate { get; set; } = DateTime.Now;
        public bool IsActive { get; set; } = true;
    }
}
