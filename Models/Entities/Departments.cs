using System.ComponentModel.DataAnnotations.Schema;

namespace Uzser.CoreServices.Models.Entities
{
    [Table("UZS_VW_DEPARTMENTS")]
    public class Departments
    {
        public short DEPARTMENT_CODE { get; set; } 
        public string DEPARTMENT_NAME { get; set; } = string.Empty;
    }
}