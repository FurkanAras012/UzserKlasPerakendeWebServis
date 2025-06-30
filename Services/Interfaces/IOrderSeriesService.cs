using Uzser.CoreServices.Models.DTO;

namespace Uzser.CoreServices.Services.Interfaces
{
    public interface IOrderSeriesService
    {
        Task<GenerateOrderNumberResponse> GenerateNextOrderNumberAsync(string seriesCode, string? userId = null);
        Task<List<OrderSeriesDto>> GetAllSeriesAsync();
        Task<OrderSeriesDto?> GetSeriesByCodeAsync(string seriesCode);
        Task<int> CreateSeriesAsync(OrderSeriesDto dto);
        Task<bool> UpdateSeriesAsync(int id, OrderSeriesDto dto);
        Task<bool> DeleteSeriesAsync(int id);
    }
}
