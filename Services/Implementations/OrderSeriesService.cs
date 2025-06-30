using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Uzser.CoreServices.Data;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;
using Uzser.CoreServices.Services.Interfaces;

namespace Uzser.CoreServices.Services.Implementations
{
    public class OrderSeriesService : IOrderSeriesService
    {
        private readonly UzserDbContext _context;
        private readonly IMapper _mapper;

        public OrderSeriesService(UzserDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<GenerateOrderNumberResponse> GenerateNextOrderNumberAsync(string seriesCode, string? userId = null)
        {
            try
            {
                Console.WriteLine($"🔢 Sipariş numarası generate ediliyor - SeriesCode: {seriesCode}");

                // Sipariş tablosundaki bu seri ile başlayan en büyük numarayı bul
                var lastOrderNumber = await _context.SalesHeader
                    .Where(x => x.OrderNumber != null && x.OrderNumber.StartsWith(seriesCode))
                    .OrderByDescending(x => x.OrderNumber)
                    .Select(x => x.OrderNumber)
                    .FirstOrDefaultAsync();

                int nextNumber = 1; // Default başlangıç

                if (!string.IsNullOrEmpty(lastOrderNumber))
                {
                    // Son sipariş numarasından seri kodunu çıkar ve sayı kısmını al
                    var numberPart = lastOrderNumber.Substring(seriesCode.Length);
                    
                    // Sayı kısmını integer'a çevir
                    if (int.TryParse(numberPart, out int currentNumber))
                    {
                        nextNumber = currentNumber + 1;
                        Console.WriteLine($"🔢 Son sipariş numarası: {lastOrderNumber}, Sıradaki: {nextNumber}");
                    }
                    else
                    {
                        Console.WriteLine($"🔢 Son sipariş numarası parse edilemedi: {lastOrderNumber}, Default: 1");
                    }
                }
                else
                {
                    Console.WriteLine($"🔢 Bu seri için hiç sipariş yok, başlangıç: 1");
                }

                // 15 karakter sipariş numarası oluştur
                // Format: SERIEKODU + 0000000000 + NUMARA
                var paddedNumber = nextNumber.ToString().PadLeft(15 - seriesCode.Length, '0');
                var orderNumber = $"{seriesCode}{paddedNumber}";

                Console.WriteLine($"🔢 Sipariş numarası oluşturuldu: {orderNumber}");

                return new GenerateOrderNumberResponse
                {
                    OrderNumber = orderNumber,
                    SeriesCode = seriesCode,
                    SerialNumber = nextNumber
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Sipariş numarası oluşturma hatası: {ex.Message}");
                throw;
            }
        }

        public async Task<List<OrderSeriesDto>> GetAllSeriesAsync()
        {
            var entities = await _context.OrderSeries
                .Where(x => x.IsActive)
                .OrderBy(x => x.SeriesCode)
                .ToListAsync();

            return _mapper.Map<List<OrderSeriesDto>>(entities);
        }

        public async Task<OrderSeriesDto?> GetSeriesByCodeAsync(string seriesCode)
        {
            var entity = await _context.OrderSeries
                .FirstOrDefaultAsync(x => x.SeriesCode == seriesCode && x.IsActive);

            return entity == null ? null : _mapper.Map<OrderSeriesDto>(entity);
        }

        public async Task<int> CreateSeriesAsync(OrderSeriesDto dto)
        {
            var entity = _mapper.Map<OrderSeries>(dto);
            entity.CreateDate = DateTime.Now;
            entity.UpdateDate = DateTime.Now;

            _context.OrderSeries.Add(entity);
            await _context.SaveChangesAsync();

            return entity.Id;
        }

        public async Task<bool> UpdateSeriesAsync(int id, OrderSeriesDto dto)
        {
            var entity = await _context.OrderSeries.FirstOrDefaultAsync(x => x.Id == id);
            if (entity == null) return false;

            _mapper.Map(dto, entity);
            entity.UpdateDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteSeriesAsync(int id)
        {
            var entity = await _context.OrderSeries.FirstOrDefaultAsync(x => x.Id == id);
            if (entity == null) return false;

            entity.IsActive = false;
            entity.UpdateDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
