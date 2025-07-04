// src/Backend/Services/GeradorTextoServiceLocalOllama.cs
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class GeradorTextoServiceLocalOllama : IGeradorTextoService
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public GeradorTextoServiceLocalOllama(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<string> GerarTextoAsync(string prompt, string modelName)
        {
            var client = _httpClientFactory.CreateClient();
            var requestData = new { model = modelName, prompt = prompt, stream = false };
            var content = new StringContent(JsonSerializer.Serialize(requestData), Encoding.UTF8, "application/json");

            // CORREÇÃO: Dentro do Docker, os serviços se comunicam pelos nomes, não por localhost.
            var response = await client.PostAsync("http://ollama:11434/api/generate", content);

            if (response.IsSuccessStatusCode)
            {
                var responseString = await response.Content.ReadAsStringAsync();
                using var jsonDoc = JsonDocument.Parse(responseString);
                return jsonDoc.RootElement.GetProperty("response").GetString() ?? "Não foi possível extrair a resposta.";
            }

            var errorBody = await response.Content.ReadAsStringAsync();
            return $"Erro ao se comunicar com o Ollama: {response.ReasonPhrase} - {errorBody}";
        }
    }
}