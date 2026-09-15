# E-Portfolio (ASP.NET Core, no database)

A simple ASP.NET Core MVC site. Project content is hardcoded in
`Data/ProjectCatalog.cs` — no database, no connection strings, nothing to
install beyond the .NET SDK.

## Setup

1. Install the .NET SDK (9.x) if you don't have it.
2. From inside the project folder:
   ```
   dotnet restore
   dotnet run
   ```
3. Visit `https://localhost:5001` (or the port shown in the console).

## Filling in your content

- Edit `Data/ProjectCatalog.cs` to add, remove, or update projects. Each
  project is just a `new Project { ... }` entry in a list — no migrations,
  no SQL, no server to restart other than `dotnet run` itself.
- Add `RepoUrl`, `DemoUrl`, and especially `EmbedUrl` (a hosted URL for your
  A-Frame museum) to make the case-study page embed the live 3D scene in an
  iframe.
- Fill in real content in `Views/Home/About.cshtml` and
  `Views/Home/Contact.cshtml`.
- Replace "Your Name" in `Views/Shared/_Layout.cshtml`.
- Drop screenshots into `wwwroot/images/projects/<slug>/` and reference them
  via `CoverImage` / `GalleryImages` on the matching project entry.

## Roadmap

1. **Local run** — get it booting with the seeded Biobanking project showing
   correctly.
2. **Host the A-Frame museum separately** (static hosting — GitHub Pages, or
   a folder served by this same app under `wwwroot/museum/`) and point
   `EmbedUrl` at it so the case study page shows a live, walkable demo.
3. **Add 2–4 more projects** to `ProjectCatalog.cs`, even smaller ones —
   variety shows range.
4. **Deploy** — since this is now just static content behind a lightweight
   web server, it's an easy fit for Azure App Service, Render, Railway, or
   any plain VPS. No managed database needed.
5. **Polish** — custom domain, favicon, mobile responsiveness pass, basic
   SEO meta tags.
6. **Iterate** — treat it like any other app you maintain: update it as new
   projects finish.
