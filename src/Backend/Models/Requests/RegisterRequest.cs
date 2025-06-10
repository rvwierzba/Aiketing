// Models/Requests/RegisterRequest.cs
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Requests // Ajuste o namespace
{
    public class RegisterRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8)] // Mínimo 8 caracteres, conforme configurado no Identity
        public string Password { get; set; } = string.Empty;
    }
}