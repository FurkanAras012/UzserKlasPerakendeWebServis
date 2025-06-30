using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Uzser.CoreServices.Data;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;
using Uzser.CoreServices.Services.Interfaces;

namespace Uzser.CoreServices.Services.Implementations
{
    public class UserMappingService : IUserMappingService
    {
        private readonly UzserDbContext _context;
        private readonly IMapper _mapper;

        public UserMappingService(UzserDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<FlowUser>> GetFlowUsersAsync()
        {
            var entities = await _context.FlowUsers
                .OrderBy(x => x.UserName)
                .ToListAsync();

            return entities;
        }

        public async Task<List<TigerUser>> GetTigerUsersAsync()
        {
            var entities = await _context.TigerUsers
                .OrderBy(x => x.UserName)
                .ToListAsync();

            return entities;
        }

        public async Task<List<UserMappingDto>> GetUserMappingsAsync()
        {
            var entities = await _context.UserMappings
                .Where(x => x.IsActive)
                .OrderBy(x => x.FlowUserName)
                .ToListAsync();

            return _mapper.Map<List<UserMappingDto>>(entities);
        }

        public async Task<UserMappingDto?> GetUserMappingByIdAsync(int id)
        {
            var entity = await _context.UserMappings
                .FirstOrDefaultAsync(x => x.Id == id && x.IsActive);

            return entity == null ? null : _mapper.Map<UserMappingDto>(entity);
        }

        public async Task<UserMappingDto?> GetUserMappingByFlowUserIdAsync(string flowUserId)
        {
            var entity = await _context.UserMappings
                .FirstOrDefaultAsync(x => x.FlowUserId == flowUserId && x.IsActive);

            return entity == null ? null : _mapper.Map<UserMappingDto>(entity);
        }

        public async Task<int> CreateUserMappingAsync(CreateUserMappingRequest request)
        {
            // Flow User bilgilerini al
            var flowUser = await _context.FlowUsers.FirstOrDefaultAsync(x => x.UserId == request.FlowUserId);
            var tigerUser = await _context.TigerUsers.FirstOrDefaultAsync(x => x.UserId == request.TigerUserId);

            if (flowUser == null || tigerUser == null)
            {
                throw new Exception("Flow User veya Tiger User bulunamadı");
            }

            // Aynı Flow User için mapping var mı kontrol et
            var existing = await _context.UserMappings
                .FirstOrDefaultAsync(x => x.FlowUserId == request.FlowUserId && x.IsActive);

            if (existing != null)
            {
                throw new Exception("Bu Flow User için zaten bir eşleştirme mevcut");
            }

            var entity = new UserMapping
            {
                FlowUserId = request.FlowUserId,
                FlowUserName = flowUser.UserName,
                TigerUserId = request.TigerUserId,
                TigerUserName = tigerUser.UserName,
                CreateUser = request.UserId,
                UpdateUser = request.UserId,
                IsActive = true
            };

            _context.UserMappings.Add(entity);
            await _context.SaveChangesAsync();

            return entity.Id;
        }

        public async Task<bool> UpdateUserMappingAsync(int id, CreateUserMappingRequest request)
        {
            var entity = await _context.UserMappings.FirstOrDefaultAsync(x => x.Id == id && x.IsActive);
            if (entity == null) return false;

            // Tiger User bilgilerini al
            var tigerUser = await _context.TigerUsers.FirstOrDefaultAsync(x => x.UserId == request.TigerUserId);
            if (tigerUser == null)
            {
                throw new Exception("Tiger User bulunamadı");
            }

            entity.TigerUserId = request.TigerUserId;
            entity.TigerUserName = tigerUser.UserName;
            entity.UpdateUser = request.UserId;
            entity.UpdateDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteUserMappingAsync(int id, string userId)
        {
            var entity = await _context.UserMappings.FirstOrDefaultAsync(x => x.Id == id && x.IsActive);
            if (entity == null) return false;

            entity.IsActive = false;
            entity.UpdateUser = userId;
            entity.UpdateDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
