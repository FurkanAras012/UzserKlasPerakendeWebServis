using System.ComponentModel.DataAnnotations.Schema;

namespace Uzser.CoreServices.Models.Entities
{

    public class ModelDto
    {
        public int Id { get; set; }
        public string Ad { get; set; }
        public string UserId { get; set; }
       
    }
}