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
            Console.WriteLine($"🟡 Kaydet çağrıldı - id:");

            var entity = _mapper.Map<SalesHeader>(dto);
            entity.CreateDate = DateTime.Now;
            entity.WFState = 0;

            _context.SalesHeader.Add(entity);
            await _context.SaveChangesAsync();

            return entity.Id;
        }

        public async Task<bool> UpdateAsync(int id, SalesHeaderDto dto)
        {
            Console.WriteLine($"🟡 Update çağrıldı - id: {id}");

            var entity = await _context.SalesHeader.FirstOrDefaultAsync(x => x.Id == id);
            if (entity == null) return false;

            _mapper.Map(dto, entity);
            entity.UpdateDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<SalesHeaderDto?> GetByIdAsync(int id)
        {
            var entity = await _context.SalesHeader.FirstOrDefaultAsync(x => x.FlowId == id);
            return entity == null ? null : _mapper.Map<SalesHeaderDto>(entity);
        }
    }
}
