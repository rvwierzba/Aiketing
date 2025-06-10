// Services/GeradorImagemServiceApiExterna.cs
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers; // Para AuthenticationHeaderValue
using System.Text;
using System.Text.Json; // Para serialização JSON
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration; // Para ler da configuração

namespace Backend.Services
{
    public class GeradorImagemServiceApiExterna : IGeradorImagemService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiUrl;
        private readonly string _apiKey;

        public GeradorImagemServiceApiExterna(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiUrl = configuration["HuggingFace:ImageUrl"] ?? throw new ArgumentNullException(nameof(configuration), "Hugging Face Image API URL (HuggingFace:ImageUrl) não configurado.");
            _apiKey = configuration["HuggingFace:ApiKey"] ?? throw new ArgumentNullException(nameof(configuration), "Hugging Face API Key (HuggingFace:ApiKey) não configurada.");

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
            _httpClient.Timeout = TimeSpan.FromSeconds(180); // Timeout aumentado para geração de imagem
        }

        public async Task<List<string>> GenerateImageAsync(string prompt, string style, int width, int height)
        {
            var requestBody = new
            {
                inputs = $"{prompt}, {style} style", // Combina prompt e estilo
                parameters = new
                {
                    width = width,
                    height = height,
                    num_images_per_prompt = 1 // MVP gera uma imagem por vez
                }
                // options = new { wait_for_model = true } // Pode ajudar no Free Tier da Hugging Face, mas aumenta latência. Testar conforme necessidade.
            };

            var jsonBody = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

            try
            {
                Console.WriteLine($"[Image Generator Service] Chamando API HF em: {_apiUrl} com prompt: '{prompt}' e style: '{style}'");
                HttpResponseMessage response = await _httpClient.PostAsync(_apiUrl, content);

                if (response.IsSuccessStatusCode) // Status 2xx
                {
                    Console.WriteLine("[Image Generator Service] Resposta 2xx recebida da API HF.");
                    byte[] imageBytes = await response.Content.ReadAsByteArrayAsync();

                    // Verifica se realmente recebeu bytes de imagem e se o ContentType é de imagem
                    if (imageBytes.Length > 0 && 
                        response.Content.Headers.ContentType != null && 
                        response.Content.Headers.ContentType?.MediaType.StartsWith("image/") == true) // Acesso condicional aqui já trata o null
                    {
                        // O if acima garante que response.Content.Headers.ContentType e MediaType não são nulos aqui.
                        // Usamos '!' (null-forgiving operator) para indicar ao compilador que confiamos nessa lógica.
                        Console.WriteLine($"[Image Generator Service] Recebido {imageBytes.Length} bytes de imagem com Content-Type: {response.Content.Headers.ContentType!.MediaType}");
                        string base64Image = Convert.ToBase64String(imageBytes);
                        // Retorna a imagem como uma string base64 formatada para uso em tags <img>
                        return new List<string> { $"data:{response.Content.Headers.ContentType!.MediaType};base64,{base64Image}" };
                    }
                    else
                    {
                        // Cenário onde o status é 2xx, mas o conteúdo não é o esperado (ex: modelo carregando)
                        Console.WriteLine("[Image Generator Service] Recebido sucesso (2xx) mas o conteúdo não parece ser uma imagem válida ou ContentType é nulo/inesperado.");
                        string responseContent = await response.Content.ReadAsStringAsync();
                        Console.WriteLine($"Conteúdo da resposta (primeiros 200 chars): {responseContent.Substring(0, Math.Min(responseContent.Length, 200))}");
                        
                        // Tratar especificamente mensagens de "loading" ou "not ready" se a API as retornar com status 2xx
                        if (responseContent.Contains("loading", StringComparison.OrdinalIgnoreCase) || 
                            responseContent.Contains("not ready", StringComparison.OrdinalIgnoreCase) ||
                            responseContent.Contains("currently loading", StringComparison.OrdinalIgnoreCase))
                        {
                            return new List<string> { "Erro ao gerar imagem: O modelo da API de imagem está carregando ou não está pronto. Por favor, tente novamente em alguns instantes." };
                        }
                        return new List<string> { $"Erro ao gerar imagem: A API retornou sucesso, mas não forneceu dados de imagem esperados. Conteúdo: {responseContent.Substring(0, Math.Min(responseContent.Length, 500))}" }; // Limita o tamanho da mensagem de erro
                    }
                }
                else // Status code != 2xx (Erro)
                {
                    string errorResponse = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"[Image Generator Service] Erro da API HF. Status: {response.StatusCode}. Corpo: {errorResponse}");
                    
                    // Tenta extrair uma mensagem de erro mais específica do JSON, se houver
                    try
                    {
                        using (JsonDocument doc = JsonDocument.Parse(errorResponse))
                        {
                            if (doc.RootElement.TryGetProperty("error", out JsonElement errorElement))
                            {
                                return new List<string> { $"Erro da API de imagem ({response.StatusCode}): {errorElement.ToString()}" };
                            }
                            // Algumas APIs de erro da HF podem ter "detail"
                            if (doc.RootElement.TryGetProperty("detail", out JsonElement detailElement))
                            {
                                return new List<string> { $"Erro da API de imagem ({response.StatusCode}): {detailElement.ToString()}" };
                            }
                        }
                    }
                    catch (JsonException) { /* O corpo do erro não é JSON, usa o texto completo abaixo */ }
                    
                    return new List<string> { $"Erro ao comunicar com a API de imagem ({response.StatusCode}): {errorResponse.Substring(0, Math.Min(errorResponse.Length, 500))}" }; // Limita o tamanho
                }
            }
            catch (HttpRequestException e) // Erros de rede, DNS, timeout, etc.
            {
                Console.WriteLine($"[HTTP REQUEST ERROR] Erro de comunicação ao chamar API Hugging Face ({_apiUrl}): {e.Message}");
                return new List<string> { $"Erro de comunicação com o serviço de IA de imagem: {e.Message}" };
            }
            catch (TaskCanceledException e) // Pode ocorrer devido ao HttpClient.Timeout
            {
                Console.WriteLine($"[TIMEOUT ERROR] Timeout ao chamar API Hugging Face ({_apiUrl}): {e.Message}");
                return new List<string> { "Erro ao gerar imagem: A requisição para o serviço de IA de imagem demorou muito para responder (timeout)." };
            }
            catch (Exception e) // Outros erros inesperados
            {
                Console.WriteLine($"[GENERAL ERROR] Erro inesperado ao processar resposta da API Hugging Face: {e.Message}");
                return new List<string> { $"Ocorreu um erro inesperado ao tentar gerar a imagem: {e.Message}" };
            }
        }
    }
}