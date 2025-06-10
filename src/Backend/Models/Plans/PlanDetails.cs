using System.Collections.Generic;

namespace Backend.Models.Plans
{
    public class PlanDetails
    {
        public string InternalName { get; set; } = string.Empty; 
        public string DisplayName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string BillingPeriod { get; set; } = string.Empty;
        public int TextGenerationsLimit { get; set; }
        public int ThumbnailGenerationsLimit { get; set; }
        public List<string> Features { get; set; } = new List<string>();
        public string StripePriceId { get; set; } = string.Empty;
    }
}