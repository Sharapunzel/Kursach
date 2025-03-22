using Microsoft.AspNetCore.Authentication;
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
        public IActionResult Logout()
        {
            return SignOut();
        }
    }
}
