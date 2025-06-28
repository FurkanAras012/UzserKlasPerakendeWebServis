using Uzser.CoreServices.Data;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;
using Uzser.CoreServices.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Uzser.CoreServices.Utils;

namespace Uzser.CoreServices.Services.Implementations
{
    public class VehiclesService : IVehicleService
    {
        private readonly UzserDbContext _context;
        private readonly IMapper _mapper;

        public VehiclesService(UzserDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // 🚗 Yeni araç ekle
        public async Task<int> CreateAsync(VehiclesDto dto)
{
    // 🔍 Aynı plaka var mı kontrolü
     var exists = await _context.Vehicles.AnyAsync(v => v.VehiclePlate == dto.VehiclePlate);
        if (exists)
        throw new BusinessException("Bu plakaya ait bir araç zaten mevcut.");

         var entity = _mapper.Map<Vehicles>(dto);
         entity.CreateDate = DateTime.Now;
         entity.WFState = 0;

         _context.Vehicles.Add(entity);
         await _context.SaveChangesAsync();

         return entity.Id;
}

        // 🛠️ Var olan aracı güncelle
        public async Task<bool> UpdateAsync(int id, VehiclesDto dto)
        {
            Console.WriteLine($"🟡 Araç güncelleniyor - id: {id}");

            var entity = await _context.Vehicles.FirstOrDefaultAsync(x => x.Id == id);
            if (entity == null) return false;

            _mapper.Map(dto, entity);
            entity.UpdateDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        // 🔍 Id ile araç getir
        public async Task<VehiclesDto?> GetByIdAsync(int id)
        {
            var entity = await _context.Vehicles.FirstOrDefaultAsync(x => x.Id == id);
            return entity == null ? null : _mapper.Map<VehiclesDto>(entity);
        }

        // 🗑️ Araç sil
        public async Task<bool> DeleteByIdAsync(int id)
        {
            var entity = await _context.Vehicles.FirstOrDefaultAsync(x => x.Id == id);
            if (entity == null) return false;

            _context.Vehicles.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        // 📋 Tüm araçları getir
        // public async Task<List<VehiclesDto>> GetAllAsync()
        // {
        //     var entities = await _context.Vehicles.ToListAsync();
        //     return _mapper.Map<List<VehiclesDto>>(entities);
        // }
    }
}