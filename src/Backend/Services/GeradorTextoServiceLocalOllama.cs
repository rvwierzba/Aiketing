// Services/GeradorTextoServiceLocalOllama.cs
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
// Importe o namespace da sua interface se estiver em namespace diferente
// using SeuProjetoBackend.Services; // Exemplo se o projeto for SeuProjetoBackend

namespace Backend.Services;

public class GeradorTextoServiceLocalOllama : IGeradorTextoService
{
    private readonly HttpClient _httpClient;
    // O endereço da API do Ollama local.
    // Se o Ollama estivesse em outro container Docker na mesma rede, o host seria o nome do container.
    // Mas para testar localmente na sua máquina, é localhost.
    private readonly string _ollamaApiUrl = "http://localhost:11434/api/generate";

    public GeradorTextoServiceLocalOllama(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string> GenerateTextAsync(string prompt, string modelName)
    {
        // Cria o corpo da requisição JSON que o endpoint /api/generate do Ollama espera
        var requestBody = new
        {
            model = modelName, // O nome do modelo a ser usado (Ex: "tinyllama")
            prompt = prompt,   // O texto de entrada / instrução
            stream = false     // Estamos pedindo a resposta completa de uma vez (não em streaming)
        };

        // Serializa o objeto C# para uma string JSON
        var jsonBody = JsonSerializer.Serialize(requestBody);
        // Cria o conteúdo HTTP da requisição
        var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

        try
        {
            // Faz a chamada HTTP POST assíncrona para a API do Ollama
            HttpResponseMessage response = await _httpClient.PostAsync(_ollamaApiUrl, content);

            // Verifica se a resposta da API do Ollama foi bem-sucedida (status code 2xx)
            response.EnsureSuccessStatusCode();

            // Lê o corpo da resposta HTTP como uma string (esperamos JSON)
            string responseBody = await response.Content.ReadAsStringAsync();

            // Deserializa a resposta JSON para extrair o texto gerado
            // A resposta do Ollama API /api/generate (sem stream=false) é um JSON com uma chave "response"
            using (JsonDocument doc = JsonDocument.Parse(responseBody))
            {
                // Tenta obter o valor da chave "response" no JSON
                if (doc.RootElement.TryGetProperty("response", out JsonElement responseElement))
                {
                    // Retorna o texto encontrado na chave "response", ou string vazia se for null
                    return responseElement.GetString() ?? string.Empty;
                }
                // Se a resposta JSON não tiver a chave "response" esperada, lança um erro ou retorna algo indicativo
                throw new Exception($"Resposta da API Ollama em formato inesperado. JSON recebido: {responseBody}");
            }
        }
        catch (HttpRequestException e)
        {
            // Captura erros de comunicação HTTP (problemas de conexão com o Ollama, etc.)
            Console.WriteLine($"[HTTP REQUEST ERROR] Erro ao chamar API Ollama ({_ollamaApiUrl}): {e.Message}");
            // Para o MVP, retornamos uma mensagem de erro simples. Em produção, você logaria isso e trataria melhor.
            return $"Erro de comunicação com o serviço de IA local: {e.Message}";
        }
        catch (Exception e)
        {
            // Captura outros erros que possam ocorrer (ex: erro na deserialização JSON)
            Console.WriteLine($"[GENERAL ERROR] Erro inesperado ao processar resposta da API Ollama: {e.Message}");
             return $"Erro inesperado ao processar resposta da IA: {e.Message}";
        }
    }
}