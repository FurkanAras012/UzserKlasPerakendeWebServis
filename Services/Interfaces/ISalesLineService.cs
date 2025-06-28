using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;

namespace Uzser.CoreServices.Services.Interfaces
{
    public interface ISalesLineService
    {
        Task<int> CreateLineAsync(SalesLineDto line);
        Task<bool> UpdateLineAsync(int id, SalesLineDto dto);

        Task<bool> DeleteLineAsync(int id); // ✅ Yeni eklendi
        Task<List<SalesLineDto>> GetLinesByMasterIdAsync(int flowId);
         

         Task<SalesLineDto> GetLineByIdAsync(int id);
    }
}