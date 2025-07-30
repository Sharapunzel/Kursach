using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Collections.Concurrent;
using System.Globalization;

namespace BFF.Application.Services
{
    public class CookieValidationHandler
    {
        private readonly KeycloakTokenService _keycloakTokenService;
        private readonly ILogger<CookieValidationHandler> _logger;
        private static readonly ConcurrentDictionary<string, SemaphoreSlim> TokenLocks = new();

        public CookieValidationHandler(KeycloakTokenService keycloakTokenService, ILogger<CookieValidationHandler> logger)
        {
            _keycloakTokenService = keycloakTokenService;
            _logger = logger;
        }

        public async Task OnValidatePrincipal(CookieValidatePrincipalContext context)
        {
            var props = context.Properties.Items;

            _logger.LogInformation("BEGIN COOKIE HANDLER");

            if(!props.TryGetValue(".Token.expires_at", out var expiresAt))
            {
                _logger.LogWarning("Missing token.expires_at");
                await Reject(context);
                return;
            }

            if(!DateTime.TryParseExact(expiresAt, "o", CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal, out var expire))
            {
                _logger.LogWarning("Missing token.expires_at");
                await Reject(context);
                return;
            }

            var timeUntilExpiry = expire - DateTime.UtcNow;

            if(timeUntilExpiry.TotalSeconds > 290)
            {
                _logger.LogInformation("TOKEN IS STILL ALIVE");
                return;
            }

            if (!props.TryGetValue(".Token.refresh_token", out var refreshToken) || string.IsNullOrEmpty(refreshToken))
            {
                _logger.LogWarning("Missing or empty refresh token");
                await Reject(context);
                return;
            }

            var tokenLock = TokenLocks.GetOrAdd(refreshToken, _ => new SemaphoreSlim(1, 1));
            var acquired = false;

            try
            {
                _logger.LogInformation("BEGIN TOKEN TRANSFORMATION");

                acquired = await tokenLock.WaitAsync(TimeSpan.FromSeconds(10));

                if (!acquired)
                {
                    _logger.LogWarning("Timeout acquiring token lock");
                    await Reject(context);
                    return;
                }

                var response = await _keycloakTokenService.RefreshAccessTokenAsync(refreshToken);

                props["Token.access_token"] = response.AccessToken;
                props["Token.refresh_token"] = response.RefreshToken;
                props["Token.expires_at"] = DateTime.UtcNow.AddSeconds(response.ExpiresIn).ToString("o", CultureInfo.InvariantCulture);

                context.ShouldRenew = true;

                _logger.LogInformation("Token refreshed properly");
            }
            catch(HttpRequestException ex)
            {
                _logger.LogError("Token refresh failed (network)");
                await Reject(context);
            }
            catch(Exception ex)
            {
                _logger.LogError("Token refresh failed (unexpected)");
                await Reject(context);
            }
            finally
            {
                _logger.LogInformation("BEGIN FINALLY");

                if(acquired)
                {
                    tokenLock.Release();
                }

                if(tokenLock.CurrentCount == 1 && TokenLocks.TryGetValue(refreshToken, out var existing) && ReferenceEquals(existing, tokenLock))
                {
                    TokenLocks.TryRemove(refreshToken, out _);
                }
            }

            _logger.LogInformation("LAST RETURN");
            return;

        }

        private async Task Reject(CookieValidatePrincipalContext context)
        {
            context.RejectPrincipal();
            await context.HttpContext.SignOutAsync("Cookies");
            // Для API-запросов сразу возвращаем 401
            if (IsApiRequest(context.HttpContext.Request))
            {
                context.HttpContext.Response.StatusCode = 401;
            }
            _logger.LogInformation("END OF REJECT");
        }

        private bool IsApiRequest(HttpRequest request)
        {
            return request.Path.StartsWithSegments("/api")
                   || request.Headers["X-Requested-With"] == "XMLHttpRequest";
        }
    }
}
