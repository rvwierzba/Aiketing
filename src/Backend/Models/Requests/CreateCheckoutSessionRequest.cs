// src/Backend/Models/Requests/CreateCheckoutSessionRequest.cs
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Requests
{
    public class CreateCheckoutSessionRequest
    {
        [Required]
        public string PriceId { get; set; } = string.Empty; // ID do Preço do Stripe (ex: price_xxxxxxx)
    }
}