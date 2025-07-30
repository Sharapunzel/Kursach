using BFF.Application.Services;
using Microsoft.IdentityModel.Tokens;
using Yarp.ReverseProxy.Transforms;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption.ConfigurationModel;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;

namespace BFF
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var rootPath = Directory.GetCurrentDirectory();
            var keyStoragePath = Path.Combine(rootPath, "keys");

            if (!Directory.Exists(keyStoragePath))
            {
                Directory.CreateDirectory(keyStoragePath);
            }

            var builder = WebApplication.CreateBuilder(args);
            var configuration = builder.Configuration;

            //services
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
                    policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173", "http://localhost", "http://127.0.0.1", "http://localhost:8080", "http://127.0.0.1:8080")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                });
            });

            builder.Services.AddDataProtection()
                .SetApplicationName("bff_app")
                .PersistKeysToFileSystem(new DirectoryInfo(keyStoragePath))
                .UseCryptographicAlgorithms(new AuthenticatedEncryptorConfiguration
                {
                    EncryptionAlgorithm = EncryptionAlgorithm.AES_256_CBC,
                    ValidationAlgorithm = ValidationAlgorithm.HMACSHA256
                });

            //proxy
            builder.Services.AddReverseProxy()
                .LoadFromConfig(configuration.GetSection("ReverseProxy"))
                .AddTransforms(builder =>
                {
                    builder.AddRequestTransform(async transformContext =>
                    {
                        Console.WriteLine(transformContext.ProxyRequest.RequestUri?.ToString());
                        var accessToken = await transformContext.HttpContext.GetTokenAsync(OpenIdConnectParameterNames.AccessToken);
                        transformContext.ProxyRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    });
                });

            //access
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

                    options.RequireHttpsMetadata = false;
                    options.GetClaimsFromUserInfoEndpoint = true;
                    options.MapInboundClaims = false;
                    options.SaveTokens = true;
                    options.UsePkce = true;

                    options.Events = new OpenIdConnectEvents
                    {
                        OnRedirectToIdentityProvider = context =>
                        {
                            // Для API-запросов блокируем редирект на Keycloak
                            if (context.Request.Path.StartsWithSegments("/BFF/api") || context.Request.Path.StartsWithSegments("/BFF/api-ws") || context.Request.Headers["X-Requested-With"] == "XMLHttpRequest")
                            {
                                context.Response.StatusCode = 401;
                                context.HandleResponse(); // Прерываем обработку
                                return Task.CompletedTask;
                            }

                            // Для не-API запросов разрешаем стандартное поведение
                            return Task.CompletedTask;
                        },

                        OnRemoteFailure = context =>
                        {
                            // Обрабатываем ошибки аутентификации
                            if (context.Failure is OpenIdConnectProtocolException)
                            {
                                if (context.Request.Path.StartsWithSegments("/api") || context.Request.Headers["X-Requested-With"] == "XMLHttpRequest")
                                {
                                    context.Response.StatusCode = 401;
                                    context.HandleResponse();
                                    return Task.CompletedTask;
                                }
                            }
                            return Task.CompletedTask;
                        }
                    };

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        NameClaimType = "name",
                        RoleClaimType = "role",
                        ValidateIssuer = true,
                        ValidIssuer = "http://localhost:8080/realms/master",
                        ValidateAudience = true,
                        ValidAudience = "BFF-client",
                        ValidateLifetime = true,
                        RequireExpirationTime = true,
                        RequireSignedTokens = true,
                    };
                });
            builder.Services.AddAuthorization();

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

            //ReauireAuthorization is not working fine throuh http local Keycloak instance
            app.MapReverseProxy().RequireAuthorization();

            app.Run();
        }
    }
}
