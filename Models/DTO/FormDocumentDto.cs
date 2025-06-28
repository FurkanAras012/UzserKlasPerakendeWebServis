

namespace Uzser.CoreServices.Models.DTO
{

    public class FormDocumentDto
    {
        public int Id { get; set; }
        public string FileName { get; set; }

        public string SavedFileName { get; set; }
        public string FilePath { get; set; }
        public string PublicUrl { get; set; }
        public string OriginalFileName { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; }
        public string FormName { get; set; }
        public int FlowId { get; set; }
        public string Description { get; set; }
        public string CreateUser { get; set; }
        public DateTime CreateDate { get; set; }
    }
}