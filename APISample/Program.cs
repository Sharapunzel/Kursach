
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using System.Text.Json;

namespace APISample
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);



            builder.Services.AddControllers();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "¬ведите JWT токен"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer",
                            }
                        },
                        new string[] {}
                    }
                });
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("CORS_API_Policy", policy =>
                {
                    policy.WithOrigins("http://localhost:5173", "http://localhost:8001")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                });
            });
            
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.Audience = builder.Configuration["Authentication:Audience"];
                    options.MetadataAddress = builder.Configuration["Authentication:MetadataAddress"]!;
                    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidIssuer = builder.Configuration["Authentication:ValidIssuer"]
                    };
                });
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireJustUserRole", policy =>
                    policy.RequireAuthenticatedUser()
                    .RequireAssertion(context =>
                    {
                        var rolesClaim = context.User.FindFirst(c => c.Type == "resource_access")?.Value;
                        if (string.IsNullOrEmpty(rolesClaim))
                            return false;

                        var resourceAccess = JsonSerializer.Deserialize<Dictionary<string, Dictionary<string, List<string>>>>(rolesClaim);
                        if (resourceAccess == null ||
                            !resourceAccess.TryGetValue("APISample-client", out var clientRoles) ||
                            clientRoles == null ||
                            !clientRoles.TryGetValue("roles", out var roles))
                            return false;

                        return roles.Contains("just_user", StringComparer.Ordinal);
                    }));
                options.AddPolicy("RequireAdminRole", policy =>
                    policy.RequireAuthenticatedUser()
                    .RequireAssertion(context =>
                    {
                        var rolesClaim = context.User.FindFirst(c => c.Type == "resource_access")?.Value;
                        if (string.IsNullOrEmpty(rolesClaim))
                            return false;

                        var resourceAccess = JsonSerializer.Deserialize<Dictionary<string, Dictionary<string, List<string>>>>(rolesClaim);
                        if (resourceAccess == null ||
                            !resourceAccess.TryGetValue("APISample-client", out var clientRoles) ||
                            clientRoles == null ||
                            !clientRoles.TryGetValue("roles", out var roles))
                            return false;

                        return roles.Contains("admin", StringComparer.Ordinal);
                    }));
            });



            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("CORS_API_Policy");

            //app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
