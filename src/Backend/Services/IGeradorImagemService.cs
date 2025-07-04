// src/Backend/Services/IGeradorImagemService.cs
namespace Backend.Services
{
    public interface IGeradorImagemService
    {
        Task<List<string>> GerarImagemAsync(string prompt, string style);
    }
}