using Uzser.CoreServices.Data;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;
using Uzser.CoreServices.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace Uzser.CoreServices.Services.Implementations
{
    public class SalesLineService : ISalesLineService
    {
        private readonly UzserDbContext _context;
        private readonly IMapper _mapper;

        public SalesLineService(UzserDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // ✅ Satır ekleme
        public async Task<int> CreateLineAsync(SalesLineDto dto)
        {
            var entity = _mapper.Map<SalesLine>(dto);
            entity.CreateDate = DateTime.Now;
            entity.CreateUser = dto.UserId;

            _context.SalesLine.Add(entity);
            await _context.SaveChangesAsync();
            return entity.Id;
        }

        // ✅ Satır güncelleme
        public async Task<bool> UpdateLineAsync(int id, SalesLineDto dto)
        {
            var entity = await _context.SalesLine.FirstOrDefaultAsync(x => x.Id == id);
            if (entity == null)
                return false;

            _mapper.Map(dto, entity); // mevcut entity üzerine mapleme
            entity.UpdateDate = DateTime.Now;
            entity.UpdateUser = dto.UserId;

            await _context.SaveChangesAsync();
            return true;
        }

        // ✅ Satır silme
        public async Task<bool> DeleteLineAsync(int id)
        {
            var entity = await _context.SalesLine.FindAsync(id);
            if (entity == null)
                return false;

            _context.SalesLine.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        // ✅ Listeleme
        public async Task<List<SalesLineDto>> GetLinesByMasterIdAsync(int masterId)
        {
            var entities = await _context.SalesLine
                .Where(x => x.MasterId == masterId)
                .ToListAsync();

            return _mapper.Map<List<SalesLineDto>>(entities);
        }

        public async Task<SalesLineDto> GetLineByIdAsync(int id)
        {
 
            var entity = await _context.SalesLine
             .AsNoTracking()
             .FirstOrDefaultAsync(x => x.Id == id);


            if (entity == null) return null;

  
         return _mapper.Map<SalesLineDto>(entity);
        }
    }
}
