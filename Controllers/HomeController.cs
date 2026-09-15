using EPortfolio.Data;
using Microsoft.AspNetCore.Mvc;

namespace EPortfolio.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index() => View(ProjectCatalog.Featured.ToList());

        public IActionResult About() => View();

        public IActionResult Contact() => View();
    }
}
