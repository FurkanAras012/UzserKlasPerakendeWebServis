using Uzser.CoreServices.Models.DTO;


namespace Uzser.CoreServices.Services.Interfaces
{
    public interface ISalesHeaderService
    {
       Task<int> CreateAsync(SalesHeaderDto dto);
        Task<bool> UpdateAsync(int id, SalesHeaderDto dto);
        Task<SalesHeaderDto?> GetByIdAsync(int id); 
        
    }
}