// src/Backend/Models/Responses/LoginResponse.cs
using System;

namespace Backend.Models.Responses
{
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}