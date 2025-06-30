using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;

namespace Uzser.CoreServices.Services.Interfaces
{
    public interface IMarkaService
    {
        Task<int> CreateAsync(MarkaDto line);
        Task<bool> UpdateAsync(int id, MarkaDto dto);
        // Task<List<MarkaDto>> GeByIdAsync(int id);
        Task<List<MarkaDto>> GetAllMarkas();
         
        
    }
}