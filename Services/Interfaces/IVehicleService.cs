using Uzser.CoreServices.Models.DTO;

namespace Uzser.CoreServices.Services.Interfaces
{
    public interface IVehicleService
    {
        Task<int> CreateAsync(VehiclesDto dto);
        Task<bool> UpdateAsync(int id, VehiclesDto dto);
        Task<VehiclesDto?> GetByIdAsync(int id);
        Task<bool> DeleteByIdAsync(int id);
       // Task<List<VehiclesDto>> GetAllAsync();
    }
}