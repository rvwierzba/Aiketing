// Models/Requests/LoginRequest.cs
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Requests // Ajuste o namespace
{
    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}