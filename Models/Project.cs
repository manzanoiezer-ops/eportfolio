using System.Collections.Generic;

namespace EPortfolio.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;          // used in the URL, e.g. /projects/virtual-biobanking
        public string Summary { get; set; } = string.Empty;       // one-line hook for the grid card

        public string? Problem { get; set; }
        public string? RoleAndStack { get; set; }
        public string? Result { get; set; }

        // Simple lists — no join tables or DB needed, data lives in Data/ProjectCatalog.cs
        public List<string> TechStack { get; set; } = new();
        public List<string> Highlights { get; set; } = new();
        public List<string> Challenges { get; set; } = new();

        public string? RepoUrl { get; set; }
        public string? DemoUrl { get; set; }
        public string? EmbedUrl { get; set; }      // hosted A-Frame museum URL for the iframe
        public string? CoverImage { get; set; }
        public List<string> GalleryImages { get; set; } = new();   // extra screenshots shown on the case-study page

        public bool Featured { get; set; }
        public int SortOrder { get; set; }
    }
}
