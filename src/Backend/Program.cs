// src/Backend/Program.cs
using Backend.Data;
using Backend.Models;
using Backend.Models.Requests;
using Backend.Models.Responses;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Stripe;
using Stripe.Checkout;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"] ?? throw new InvalidOperationException("Chave Stripe não configurada.");
builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Version = "v1", Title = "AIketing API" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme { In = ParameterLocation.Header, Description = "JWT Authorization header. Ex: Bearer {token}", Name = "Authorization", Type = SecuritySchemeType.Http, Scheme = "Bearer" });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement { { new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }, new List<string>() } });
});

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddIdentity<User, IdentityRole>(options => { /* Opções do Identity */ }).AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();
builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options => {
    options.TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuerSigningKey = true, IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        ValidateIssuer = true, ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true, ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true, ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddHttpClient();
builder.Services.AddScoped<IGeradorTextoService, GeradorTextoServiceLocalOllama>();
builder.Services.AddScoped<IGeradorImagemService, GeradorImagemServiceApiExterna>();
builder.Services.AddScoped<IPlanService, PlanService>();

if (builder.Environment.IsDevelopment()) { builder.Services.AddCors(options => options.AddPolicy("AllowAll", policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader())); }

var app = builder.Build();

if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "AIketing API v1")); app.UseCors("AllowAll"); }

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// --- MANTENHA SEUS OUTROS ENDPOINTS AQUI ---

// Webhook do Stripe FINAL E CORRIGIDO
app.MapPost("/api/stripe/webhook", async (HttpRequest request, IServiceProvider sp, IConfiguration config, ILogger<Program> logger) =>
{
    var json = await new StreamReader(request.Body).ReadToEndAsync();
    var webhookSecret = config["Stripe:WebhookSecret"]!;
    try
    {
        var stripeEvent = EventUtility.ConstructEvent(json, request.Headers["Stripe-Signature"], webhookSecret);
        logger.LogInformation("--> Webhook recebido: {type}", stripeEvent.Type);

        if (stripeEvent.Type == Stripe.Events.CheckoutSessionCompleted)
        {
            var session = stripeEvent.Data.Object as Session;
            if (session?.PaymentStatus == "paid")
            {
                await using var scope = sp.CreateAsyncScope();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
                var planService = scope.ServiceProvider.GetRequiredService<IPlanService>();
                
                var user = await userManager.FindByIdAsync(session.ClientReferenceId);
                if (user == null) { logger.LogError("Usuário {UserId} não encontrado no webhook.", session.ClientReferenceId); return Results.NotFound(); }

                var subscriptionService = new SubscriptionService();
                var subscription = await subscriptionService.GetAsync(session.SubscriptionId);
                var priceId = subscription.Items.Data.FirstOrDefault()?.Price.Id;

                if (string.IsNullOrEmpty(priceId)) { logger.LogError("PriceId não encontrado na assinatura {SubscriptionId}", session.SubscriptionId); return Results.BadRequest(); }

                var newPlan = planService.GetPlanByStripePriceId(priceId);
                if (newPlan != null)
                {
                    user.StripeCustomerId = session.CustomerId;
                    user.StripeSubscriptionId = subscription.Id;
                    user.CurrentPlanName = newPlan.InternalName;
                    user.SubscriptionCycleStart = subscription.CurrentPeriodStart; // Propriedade correta
                    await userManager.UpdateAsync(user);
                    logger.LogInformation("Plano do usuário {email} atualizado para {plan}", user.Email, newPlan.DisplayName);
                }
            }
        }
        return Results.Ok();
    }
    catch (Exception e)
    {
        logger.LogError(e, "Erro no webhook do Stripe");
        return Results.BadRequest();
    }
}).WithName("StripeWebhook");

app.Run();