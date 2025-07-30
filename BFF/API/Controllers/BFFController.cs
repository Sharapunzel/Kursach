using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace BFF.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BFFController : ControllerBase
    {
        [HttpGet("[action]")]
        public async Task<IActionResult> GetToken()
        {
            if (User.Identity?.IsAuthenticated != true)
                return Unauthorized();

            var token = await HttpContext.GetTokenAsync("access_token");

            return Ok(new { token = token });
        }

        [HttpGet("[action]")]
        public ActionResult<IDictionary<string, string>> CheckSession()
        {
            if (User.Identity?.IsAuthenticated != true)
                return Unauthorized();

            return User.Claims.ToDictionary(claim => claim.Type, claim => claim.Value);
        }

        [HttpGet("[action]")]
        public ActionResult<IDictionary<string, string>> Login()
        {
            return Challenge(new AuthenticationProperties { RedirectUri = "http://localhost:5173/" });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Logout()
        {
            // Offline session will not revoke. Use regular sessions instead
            return SignOut(new AuthenticationProperties { RedirectUri = "/" }, ["Cookies", "oidc"] );
        }
    }
}
