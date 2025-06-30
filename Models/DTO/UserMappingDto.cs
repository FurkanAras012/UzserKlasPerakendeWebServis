namespace Uzser.CoreServices.Models.DTO
{
    public class UserMappingDto
    {
        public int Id { get; set; }
        
        public string FlowUserId { get; set; } = string.Empty;
        public string FlowUserName { get; set; } = string.Empty;
        
        public int TigerUserId { get; set; }
        public string TigerUserName { get; set; } = string.Empty;
        
        public string? CreateUser { get; set; }
        public string? UpdateUser { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateUserMappingRequest
    {
        public string FlowUserId { get; set; } = string.Empty;
        public int TigerUserId { get; set; }
        public string? UserId { get; set; }
    }
}
