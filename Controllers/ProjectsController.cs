using EPortfolio.Data;
using Microsoft.AspNetCore.Mvc;

namespace EPortfolio.Controllers
{
    public class ProjectsController : Controller
    {
        public IActionResult Index() => View(ProjectCatalog.AllOrdered.ToList());

        [Route("projects/{slug}")]
        public IActionResult Details(string slug)
        {
            var project = ProjectCatalog.BySlug(slug);
            if (project == null) return NotFound();
            return View(project);
        }
    }
}
