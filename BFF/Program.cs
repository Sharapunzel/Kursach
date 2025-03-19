using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

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

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("DevelopClientPermission", policy =>
                {
                    policy.AllowAnyMethod()
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .WithOrigins("http://localhost:5173")
                                .AllowCredentials();
                });
            });

            //доступ
            builder.Services.AddAuthorization();

            // настройка 
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultScheme = "cookie";
                options.DefaultChallengeScheme = "oidc";
            })
                .AddCookie("cookie", options =>
                {
                    options.Cookie.Name = "web";
                    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                    options.Events.OnSigningOut = async e => { await e.HttpContext.RevokeRefreshTokenAsync(); };
                })
                .AddOpenIdConnect("oidc", options =>
                {
                    options.Authority = "http://localhost:8080/realms/master";

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
                });

            // adds services for token management
            builder.Services.AddOpenIdConnectAccessTokenManagement();


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
