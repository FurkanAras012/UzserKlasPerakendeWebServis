using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uzser.CoreServices.Models.Entities
{
    [Table("Modeller")]
      public class Model
    {
        [Key]
        public int Id { get; set; }
        public string Ad { get; set; }
       
    }
}