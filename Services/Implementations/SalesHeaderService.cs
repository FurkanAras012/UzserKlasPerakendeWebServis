using Uzser.CoreServices.Data;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;
using Uzser.CoreServices.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace Uzser.CoreServices.Services.Implementations
{
    public class SalesHeaderService : ISalesHeaderService
    {
        private readonly UzserDbContext _context;
        private readonly IMapper _mapper;

        public SalesHeaderService(UzserDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(SalesHeaderDto dto)
        {
            Console.WriteLine($"🟡 CreateAsync çağrıldı - CustomerCode: {dto.CustomerCode}, UserId: {dto.UserId}");

            var entity = _mapper.Map<SalesHeader>(dto);
            entity.CreateDate = DateTime.Now;
            entity.WFState = 0;
            
            // UserId'yi manuel olarak set et (mapping'e ek güvence)
            if (!string.IsNullOrEmpty(dto.UserId))
            {
                entity.CreateUser = dto.UserId;
                // İlk kayıtta UpdateUser'ı boş bırak, sadece gerçek update'lerde set et
            }

            _context.SalesHeader.Add(entity);
            await _context.SaveChangesAsync();

            Console.WriteLine($"🟡 Entity kaydedildi - ID: {entity.Id}, CreateUser: {entity.CreateUser}");
            return entity.Id;
        }

        public async Task<bool> UpdateAsync(int id, SalesHeaderDto dto)
        {
            Console.WriteLine($"🟡 Update çağrıldı - id: {id}, UserId: {dto.UserId}");

            var entity = await _context.SalesHeader.FirstOrDefaultAsync(x => x.Id == id);
            if (entity == null) return false;

            _mapper.Map(dto, entity);
            entity.UpdateDate = DateTime.Now;
            
            // UserId'yi manuel olarak UpdateUser'a set et
            if (!string.IsNullOrEmpty(dto.UserId))
            {
                entity.UpdateUser = dto.UserId;
            }

            await _context.SaveChangesAsync();
            Console.WriteLine($"🟡 Entity güncellendi - ID: {entity.Id}, UpdateUser: {entity.UpdateUser}");
            return true;
        }

        public async Task<SalesHeaderDto?> GetByIdAsync(int id)
        {
            Console.WriteLine($"🟡 GetByIdAsync çağrıldı - id: {id}");
            
            var entity = await _context.SalesHeader.FirstOrDefaultAsync(x => x.Id == id);
            
            Console.WriteLine($"🟡 Entity bulundu: {entity?.Id}");
            
            return entity == null ? null : _mapper.Map<SalesHeaderDto>(entity);
        }

        public async Task<SalesHeaderDto?> GetByFlowIdAsync(int flowId)
        {
            Console.WriteLine($"🟡 GetByFlowIdAsync çağrıldı - flowId: {flowId}");
            
            var entity = await _context.SalesHeader.FirstOrDefaultAsync(x => x.FlowId == flowId);
            
            Console.WriteLine($"🟡 FlowId ile entity bulundu: {entity?.Id}");
            
            return entity == null ? null : _mapper.Map<SalesHeaderDto>(entity);
        }
    }
}
