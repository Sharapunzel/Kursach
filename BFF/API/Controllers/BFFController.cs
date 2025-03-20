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
        /*private readonly IUserTokenManagementService _userTokenManagementService;

        public BFFController(IUserTokenManagementService userTokenManagementService)
        {
            _userTokenManagementService = userTokenManagementService;
        }*/

        [HttpGet("[action]")]
        public async Task<IActionResult> Get()
        {
            if (User.Identity?.IsAuthenticated != true)
                return Unauthorized();

            var token = await HttpContext.GetTokenAsync("access_token");

            return Ok(new {token = token});
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetUsual()
        {
            return Ok(new { info = "Hello world!" });
        }

        [HttpGet("[action]")]
        public ActionResult<IDictionary<string, string>> CheckSession()
        {
            // return 401 Unauthorized to force SPA redirection to Login endpoint
            if (User.Identity?.IsAuthenticated != true)
                return Unauthorized();

            return User.Claims.ToDictionary(claim => claim.Type, claim => claim.Value);
        }

        [HttpGet("[action]")]
        public ActionResult<IDictionary<string, string>> Login()
        {
            // Logic to initiate the authorization code flow
            return Challenge(new AuthenticationProperties { RedirectUri = "http://localhost:5173/" });
        }

        [HttpPost("[action]")]
        public IActionResult Logout()
        {
            return SignOut();
        }
    }
}
