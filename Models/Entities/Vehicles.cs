using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
namespace Uzser.CoreServices.Models.Entities

{

    [Table("UZS_TBL_VEHICLES")]
    public class Vehicles
    {
        [Key]

        public int Id { get; set; }

        public DateTime CreateDate { get; set; } = DateTime.Now;
        public string CreateUser { get; set; } = string.Empty;
        public DateTime? UpdateDate { get; set; }
        public string? UpdateUser { get; set; } = string.Empty;
        public int WFState { get; set; } = 0;

        public string VehiclePlate { get; set; } = null!;


        public string ChassisNumber { get; set; } = null!;


        public string EngineNumber { get; set; } = null!;


        public string Brand { get; set; } = null!;


        public string Model { get; set; } = null!;

        public string ModelYear { get; set; } = null!;


        public string FuelType { get; set; } = null!;


        public string EnginePower { get; set; } = null!;

        public string Kilometer { get; set; } = null!;


        public string TireTreadDepth { get; set; } = null!;

        public string? BatteryStatus { get; set; }
    }

}