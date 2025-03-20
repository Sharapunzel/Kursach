using BFF.Application.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Globalization;

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
                options.AddPolicy("DevelopClientPermission", policy =>
                {
                    policy.AllowAnyMethod()
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .WithOrigins("http://localhost:5173", "http://192.168.0.102:5173")
                                .AllowCredentials();
                });
            });

            //доступ
            builder.Services.AddAuthorization();

            // настройка 
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultScheme = "Cookies";
                options.DefaultChallengeScheme = "oidc";
            })
                .AddCookie("Cookies", options =>
                {
                    options.Cookie.Name = "bff_cookies";
                    //options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                    //equeal to session time (refresh token lifespan)
                    options.ExpireTimeSpan = TimeSpan.FromMinutes(5);
                    options.LoginPath = "/BFF/Login";
                    options.Events.OnSigningOut = async e => { await e.HttpContext.SignOutAsync(); };

                    var serviceProvider = builder.Services.BuildServiceProvider();
                    var cookieValidationService = serviceProvider.GetRequiredService<CookieValidationHandler>();

                    options.Events.OnValidatePrincipal = cookieValidationService.OnValidatePrincipal;

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

                    // requests a refresh token
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
                    /*options.Events = new OpenIdConnectEvents()
                    {
                        OnTokenValidated = c =>
                        {
                            c.Properties.StoreTokens(new[] { new AuthenticationToken
                                {
                                    Name = "id_token",
                                    Value = c.ProtocolMessage.IdToken
                                }
                            });

                            return Task.CompletedTask;
                        }
                    };*/
                });

            // adds services for token management
            /*builder.Services.AddOpenIdConnectAccessTokenManagement();
            builder.Services.AddClientCredentialsTokenManagement(options =>
            {
                options.CacheLifetimeBuffer = 60;
                options.CacheKeyPrefix = "Duende.AccessTokenManagement.Cache::";
            });*/


            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("DevelopClientPermission");
            //app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
