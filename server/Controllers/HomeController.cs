using Microsoft.AspNetCore.Mvc;

namespace aurelia.coreclr.app.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index() => File("~/index.html", "text/html");
    }
}
