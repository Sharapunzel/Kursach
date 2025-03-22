using BFF.Application.Services;
using Microsoft.IdentityModel.Tokens;
using Yarp.ReverseProxy.Transforms;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration;

namespace BFF
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var configuration = builder.Configuration;

            //сервисы
            builder.Services.AddControllers();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDistributedMemoryCache();
            builder.Services.AddSingleton<KeycloakTokenService>();
            builder.Services.AddScoped<CookieValidationHandler>();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("CORS_BFF_Policy", policy =>
                {
                    policy.WithOrigins("http://localhost:5173", "http://localhost:8080", "http://192.168.0.102:5173")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                });
            });

            //прокси
            builder.Services.AddReverseProxy()
                .LoadFromConfig(configuration.GetSection("ReverseProxy"))
                .AddTransforms(builder =>
                {
                    builder.AddRequestTransform(async transformContext =>
                    {
                        var accessToken = await transformContext.HttpContext.GetTokenAsync(OpenIdConnectParameterNames.AccessToken);
                        transformContext.ProxyRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    });
                });

            //доступ
            builder.Services.AddAuthorization();
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultScheme = "Cookies";
                options.DefaultChallengeScheme = "oidc";
            })
                .AddCookie("Cookies", options =>
                {
                    options.Cookie.Name = "bff_cookies";
                    options.ExpireTimeSpan = TimeSpan.FromMinutes(5);
                    options.LoginPath = "/BFF/Login";
                    options.Events.OnValidatePrincipal = async context =>
                    {
                        var cookieValidationService = context.HttpContext.RequestServices.GetRequiredService<CookieValidationHandler>();
                        await cookieValidationService.OnValidatePrincipal(context);
                    };
                })
                .AddOpenIdConnect("oidc", options =>
                {
                    options.Authority = "http://localhost:8080/realms/master";
                    options.SignInScheme = "Cookies";
                    options.SignOutScheme = "Cookies";

                    options.ClientId = "BFF-client";
                    options.ClientSecret = "hTLKs8mqVqb0NtYqiH0HXMNREFv4oHU4";

                    options.ResponseType = "code";
                    options.ResponseMode = "query";

                    options.Scope.Clear();

                    // OIDC related scopes
                    options.Scope.Add("openid");
                    options.Scope.Add("profile");
                    options.Scope.Add("email");

                    options.Scope.Add("offline_access");
                    options.RequireHttpsMetadata = false;
                    options.GetClaimsFromUserInfoEndpoint = true;
                    options.MapInboundClaims = false;
                    options.SaveTokens = true;
                    options.UsePkce = true;

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        NameClaimType = "name",
                        RoleClaimType = "role"
                    };
                });

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("CORS_BFF_Policy");
            //app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.MapReverseProxy()
                .RequireAuthorization();

            app.Run();
        }
    }
}
