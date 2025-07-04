// src/Backend/Services/IGeradorTextoService.cs
namespace Backend.Services
{
    public interface IGeradorTextoService
    {
        Task<string> GerarTextoAsync(string prompt, string modelName);
    }
}