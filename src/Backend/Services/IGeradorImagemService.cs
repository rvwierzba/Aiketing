// Services/IGeradorImagemService.cs
using System.Threading.Tasks;
using System.Collections.Generic; // Se planeja retornar URLs ou dados da imagem

namespace Backend.Services;

public interface IGeradorImagemService
{
    // Define o método que seu backend chamará para gerar imagens
    // prompt: O texto de entrada/instrução para a IA (descrição da imagem desejada)
    // style: O estilo visual desejado (mapeia para templates/estilos definidos no MVP)
    // width, height: Dimensões da imagem (mapeia para tamanhos comuns definidos no MVP)
    // Retorna algo que represente a imagem gerada (Ex: uma URL, ou os bytes da imagem, ou base64)
    // Por enquanto, podemos retornar uma string simples ou uma lista de strings (URLs)
    Task<List<string>> GenerateImageAsync(string prompt, string style, int width, int height);

    // Podemos adicionar outros parâmetros no futuro, como negativo_prompt, número de variações, etc.
}