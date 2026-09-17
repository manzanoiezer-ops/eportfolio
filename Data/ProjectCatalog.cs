using EPortfolio.Models;

namespace EPortfolio.Data
{
    /// <summary>
    /// The portfolio's project data. No database — this is a showcase site with
    /// content that changes by editing code and redeploying, not at runtime.
    /// To add or edit a project, just add/edit an entry in the list below.
    /// </summary>
    public static class ProjectCatalog
    {
        public static readonly List<Project> All = new()
        {
            new Project
            {
                Id = 1,
                Title = "Virtual Biobanking of Stored Product Arthropods",
                Slug = "virtual-biobanking",
                Summary = "A digitized specimen archive with a walkable 3D virtual museum, built for PhilMech.",
                Problem = "PhilMech needed to digitize stored-product arthropod specimen records and make the collection browsable beyond the physical archive.",
                RoleAndStack = "Full-stack build: ASP.NET Core backend, PostgreSQL data warehouse via Npgsql, JS frontend, plus a companion Three.js/A-Frame 3D virtual museum.",
                TechStack = new List<string> { "ASP.NET Core", "PostgreSQL", "Npgsql", "JavaScript", "A-Frame", "Three.js" },
                Highlights = new List<string>
                {
                    "Migrated the data layer from a trial MySQL/XAMPP setup to a PostgreSQL warehouse",
                    "Rebuilt the backend with a dedicated SpecimenDbContext and combined-DTO API endpoints",
                    "Case-insensitive specimen search plus dedicated image/barcode/map endpoints serving binary data",
                    "Custom A-Frame slat-wall component with PBR moss textures and world-space tiling",
                    "Nav-point teleportation system and modal insect-box viewers with image sliders",
                    "Three-room virtual layout: main display room, microscopy room, laboratory area"
                },
                Challenges = new List<string>
                {
                    "Resolved z-fighting on display case geometry",
                    "Fixed a rendering conflict between logarithmicDepthBuffer and troika-text",
                    "Tuned doorway widths (0.905m to 1.09m) for consistent walking clearance",
                    "Redesigned lighting and materials toward a clinical biobanking-lab aesthetic"
                },
                Result = "A live specimen database paired with an explorable 3D museum, giving the collection a public-facing presence beyond static records.",
                RepoUrl = null,   // add your GitHub link
                DemoUrl = null,
                EmbedUrl = null,  // fill in once the A-Frame museum is publicly hosted
                CoverImage = "/images/projects/virtual-biobanking/room1.png",
                GalleryImages = new List<string>
                {
                    "/images/projects/virtual-biobanking/room1.png",
                    "/images/projects/virtual-biobanking/room2.png",
                    "/images/projects/virtual-biobanking/insect1.png"
                },
                Featured = true,
                SortOrder = 1
            },

            new Project
            {
                Id = 2,
                Title = "Sample Project",
                Slug = "sample-project",
                Summary = "Placeholder — replace with your next project.",
                TechStack = new List<string> { "ASP.NET Core" },
                CoverImage = "/images/projects/sample-project.jpg",
                Featured = false,
                SortOrder = 2
            }
        };

        public static IEnumerable<Project> Featured =>
            All.Where(p => p.Featured).OrderBy(p => p.SortOrder);

        public static IEnumerable<Project> AllOrdered =>
            All.OrderBy(p => p.SortOrder);

        public static Project? BySlug(string slug) =>
            All.FirstOrDefault(p => p.Slug == slug);
    }
}