using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;

namespace Uzser.CoreServices.Services.Interfaces
{
    public interface ILookupService
    {
        Task<List<LookupItemDto>> GetStockListAsync();
        Task<List<CustomerDto>> GetCustomerListAsync();

        Task<List<DepartmentsDto>> GetDepartmentListAsync();

         Task<List<VehiclesDto>> GetVehiclesListAsync();
    }
}