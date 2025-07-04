// src/Backend/Services/GeradorImagemServiceApiExterna.cs
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class GeradorImagemServiceApiExterna : IGeradorImagemService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string? _huggingFaceApiKey;

        public GeradorImagemServiceApiExterna(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _huggingFaceApiKey = configuration["HuggingFace:ApiKey"];
        }

        // MÉTODO QUE ESTAVA FALTANDO, AGORA IMPLEMENTADO
        public async Task<List<string>> GerarImagemAsync(string prompt, string style)
        {
            if (string.IsNullOrEmpty(_huggingFaceApiKey))
            {
                throw new System.InvalidOperationException("HuggingFace API Key não configurada.");
            }

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _huggingFaceApiKey);

            var requestData = new { inputs = $"{prompt}, {style}" };
            var content = new StringContent(JsonSerializer.Serialize(requestData), Encoding.UTF8, "application/json");

            var response = await client.PostAsync("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev", content);

            if (response.IsSuccessStatusCode)
            {
                var imageBytes = await response.Content.ReadAsByteArrayAsync();
                var base64Image = $"data:image/jpeg;base64,{System.Convert.ToBase64String(imageBytes)}";
                return new List<string> { base64Image };
            }

            var errorContent = await response.Content.ReadAsStringAsync();
            throw new System.Exception($"Erro da API HuggingFace: {response.ReasonPhrase} - {errorContent}");
        }
    }
}