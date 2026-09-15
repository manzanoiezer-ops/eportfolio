# Image guide

## profile/
- `headshot.jpg` — used by the facecard on the About page (`Views/Home/About.cshtml`)
- Square, ~400x400px, JPG/WebP, face centered (it's cropped into a circle via CSS)

## projects/
- One cover image per project, filename referenced by the `cover_image` column in Postgres
  (or `Project.CoverImage` if you seed it in code)
- 1600x900px (16:9), JPG/WebP, under ~300KB — shown on the homepage featured card,
  the /projects grid, and as the banner on each project's case-study page
- Screenshot, mockup, or a representative render works well; avoid busy full-res screenshots,
  they get cropped to 16:9 / 21:9 by CSS `object-fit: cover`

## backgrounds/
- `hero-bg.jpg` — subtle full-bleed background behind the homepage hero
  (`Views/Home/Index.cshtml`, `.hero` in `site.css`)
- Wide (1920px+), low-contrast/desaturated or blurred so the white heading text stays readable —
  a faded texture, gradient mesh, or softly blurred 3D screenshot works better than a sharp photo
- The CSS already layers a fade-to-background gradient over it; keep the image itself fairly plain

## Not committing real photos to git?
Add `wwwroot/images/**/*.jpg` (etc.) to `.gitignore` and keep only `.gitkeep` placeholders in
version control — deploy the real files separately, or commit them if you don't mind them public.
