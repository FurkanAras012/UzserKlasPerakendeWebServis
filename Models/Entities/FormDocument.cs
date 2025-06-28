using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uzser.CoreServices.Models.Entities
{
    [Table("UZS_TBL_FORMDOCUMENTS")]
    public class FormDocument
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string CreateUser { get; set; }

        [Required]
        public DateTime CreateDate { get; set; } = DateTime.Now;

        [Required]
        public int FlowId { get; set; }

        [Required]
        [MaxLength(255)]
        public string FileName { get; set; }

       [Required]
        public string SavedFileName { get; set; } // Sunucuda fiziksel ad

        [Required]
        [MaxLength(500)]
        public string FilePath { get; set; }

        [Required]
        [MaxLength(500)]
        public string OriginalFileName { get; set; }

        [Required]
        [MaxLength(50)]
        public string FileType { get; set; }

        [Required]
        public long FileSize { get; set; }

        [Required]
        public string FormName { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }
    }
}