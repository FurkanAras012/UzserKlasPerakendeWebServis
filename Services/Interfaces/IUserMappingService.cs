using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;

namespace Uzser.CoreServices.Services.Interfaces
{
    public interface IUserMappingService
    {
        Task<List<FlowUser>> GetFlowUsersAsync();
        Task<List<TigerUser>> GetTigerUsersAsync();
        Task<List<UserMappingDto>> GetUserMappingsAsync();
        Task<UserMappingDto?> GetUserMappingByIdAsync(int id);
        Task<UserMappingDto?> GetUserMappingByFlowUserIdAsync(string flowUserId);
        Task<int> CreateUserMappingAsync(CreateUserMappingRequest request);
        Task<bool> UpdateUserMappingAsync(int id, CreateUserMappingRequest request);
        Task<bool> DeleteUserMappingAsync(int id, string userId);
    }
}
