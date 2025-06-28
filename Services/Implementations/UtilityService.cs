using System;
using System.Drawing;
using Uzser.CoreServices.Services.Interfaces;

namespace Uzser.CoreServices.Services.Implementations
{
    public class UtilityService : IUtilityService
    {
        public byte[] Base64ToPngBytes(string base64)
{
    byte[] imageBytes = Convert.FromBase64String(base64);
    if (imageBytes == null || imageBytes.Length == 0)
        throw new ArgumentException("Geçersiz Base64 dizesi.", nameof(base64));

    using var ms = new MemoryStream(imageBytes);
    using var image = new Bitmap(ms); // GDI+ uyumlu, belleğe alınır

    using var outputStream = new MemoryStream();
    image.Save(outputStream, System.Drawing.Imaging.ImageFormat.Png);
    return outputStream.ToArray(); // PNG byte[] döndür
}

        public string SaveBase64ToFile(string base64, string folderPath)
    {
        byte[] imageBytes = Convert.FromBase64String(base64);
        using var ms = new MemoryStream(imageBytes);
        using var image = new Bitmap(ms);

         var fileName = $"IMG_{Guid.NewGuid():N}.png";
         var fullPath = Path.Combine(folderPath, fileName);

        image.Save(fullPath, System.Drawing.Imaging.ImageFormat.Png);
        return fileName; // frontend'e gönder
    }
    public Image Base64ToImage(string base64)
{
    byte[] imageBytes = Convert.FromBase64String(base64);
    using var ms = new MemoryStream(imageBytes);
    return new Bitmap(ms);
}

        public byte[] Base64ToBytes(string base64)
        {
            return Convert.FromBase64String(base64);
        }

        public string BytesToBase64(byte[] bytes)
        {
            return Convert.ToBase64String(bytes);
        }

        public byte[] ConvertHtmlToPdf(string html)
        {
            throw new NotImplementedException("Html to PDF dönüşümü henüz entegre edilmedi.");
        }
    }
}