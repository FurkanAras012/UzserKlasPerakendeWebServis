using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;

namespace Uzser.CoreServices.Services.Interfaces
{
    public interface IUzserCustomerService
    {
        Task<int> CreateAsync(UzserCustomerDto dto);
        Task<bool> UpdateAsync(int id, UzserCustomerDto dto);
        Task<UzserCustomerDto?> GetByIdAsync(int id);
        Task<UzserCustomerDto?> GetByCodeAsync(string customerCode);
        Task<UzserCustomerDto?> GetByFlowIdAsync(int flowId);
        // Task<bool> DeleteByIdAsync(int id);
       // Task<List<VehiclesDto>> GetAllAsync();
    }
}