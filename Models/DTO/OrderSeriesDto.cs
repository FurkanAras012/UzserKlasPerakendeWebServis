namespace Uzser.CoreServices.Models.DTO
{
    public class OrderSeriesDto
    {
        public int Id { get; set; }
        public string SeriesCode { get; set; } = string.Empty;
        public string SeriesName { get; set; } = string.Empty;
        public int CurrentNumber { get; set; }
        public string? LastOrderNumber { get; set; } = string.Empty;
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public string? CreateUser { get; set; }
        public string? UpdateUser { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class GenerateOrderNumberRequest
    {
        public string SeriesCode { get; set; } = string.Empty;
        public string? UserId { get; set; }
    }

    public class GenerateOrderNumberResponse
    {
        public string OrderNumber { get; set; } = string.Empty;
        public string SeriesCode { get; set; } = string.Empty;
        public int SerialNumber { get; set; }
    }
}
