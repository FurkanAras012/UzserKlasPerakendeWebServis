using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;

namespace Uzser.CoreServices.Services.Interfaces
{
    public interface IModelService
    {
        Task<int> CreateAsync(ModelDto line);
        Task<bool> UpdateAsync(int id, ModelDto dto);

        // Task<List<ModelDto>> GetByIdAsync(int id);
         

          Task<List<ModelDto>> GetAllModels();
    }
}