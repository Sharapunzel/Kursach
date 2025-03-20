using Microsoft.AspNetCore.Authentication.Cookies;
using System.Globalization;

namespace BFF.Application.Services
{
    public class CookieValidationHandler
    {
        private readonly KeycloakTokenService _keycloakTokenService;

        public CookieValidationHandler(KeycloakTokenService keycloakTokenService)
        {
            _keycloakTokenService = keycloakTokenService;
        }

        public async Task OnValidatePrincipal(CookieValidatePrincipalContext context)
        {
            if (context.Properties.Items.ContainsKey(".Token.expires_at"))
            {
                var expire = DateTime.Parse(context.Properties.Items[".Token.expires_at"]);

                DateTime now = DateTime.Now;
                TimeSpan difference = expire - now;
                double differenceInSeconds = difference.TotalSeconds;

                if (expire < now && differenceInSeconds < Math.Abs(240))
                {
                    var refreshToken = context.Properties.Items[".Token.refresh_token"];

                    var response = await _keycloakTokenService.RefreshAccessTokenAsync(refreshToken);

                    if (response == null)
                    {
                        context.RejectPrincipal();
                        context.Response.Redirect("/BFF/Login");
                        return;
                    }

                    context.Properties.Items[".Token.access_token"] = response.AccessToken;
                    context.Properties.Items[".Token.refresh_token"] = response.RefreshToken;
                    context.Properties.Items[".Token.expires_at"] = DateTime.Now.AddSeconds(response.ExpiresIn).ToString("s", System.Globalization.CultureInfo.InvariantCulture);

                    context.ShouldRenew = true;
                }
                else if (expire > now)
                {
                    return;
                }
                else
                {
                    context.RejectPrincipal();
                    context.Response.Redirect("/BFF/Login");
                    return;
                }
            }
            return;
        }
    }
}
