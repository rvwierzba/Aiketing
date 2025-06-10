// src/Backend/Services/IPlanService.cs
using Backend.Models.Plans;
using System.Collections.Generic; // Necessário para IEnumerable

namespace Backend.Services
{
    public interface IPlanService
    {
        PlanDetails? GetPlanDetails(string? planName);
        PlanDetails GetDefaultPlan();
        IEnumerable<PlanDetails> GetAllPlans(); // Método para buscar todos os planos
    }
}