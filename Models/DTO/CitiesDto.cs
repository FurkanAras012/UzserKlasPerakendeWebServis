using System;
using System.ComponentModel.DataAnnotations;

namespace Uzser.CoreServices.Models.DTO
{
    public class CitiesDto
    {
        public int LOGICALREF { get; set; }
        public int COUNTRY { get; set; } 
        public string NAME { get; set; } = string.Empty;
        public string CODE { get; set; } = string.Empty;
    }
}
