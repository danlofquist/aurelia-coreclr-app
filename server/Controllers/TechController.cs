using Microsoft.AspNetCore.Mvc;

namespace aurelia.coreclr.app.Controllers
{
    [Route("api/[controller]")]
    public class TechController : Controller
    {
        public dynamic Get()
        {
            return new[] {
                new { tech = "Aurelia" },
                new { tech = "coreclr" }
            };
        }
    }
}
