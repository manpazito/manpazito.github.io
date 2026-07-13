# manpazito.github.io

Personal portfolio site for Manuel Martinez Garcia, UCLA master's student in Transportation Engineering researching optimization, machine learning applications to transportation, routing, and simulation.

Live at: https://manpazito.github.io

## Structure

```
/projects/      - Research, engineering, and applied data projects
/projects/*/    - Individual project detail pages
/cv/            - Resume (PDF viewer)

/assets/css/    - Global stylesheet
/assets/img/    - Images grouped by type: icons, logos, maps, photos, posters, profile, and project media
/assets/cv/     - Resume PDF

/sitemap.xml    - Search crawler URL index

/robots.txt     - Crawler directives + sitemap location

/_config.yml    - GitHub Pages/Jekyll site config
```

## Stack

- Static HTML/CSS site
- No frontend framework or bundler
- Served via GitHub Pages

## Local development

No build step is required. From the repo root, serve files locally with any static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Updating resume

To update the resume PDF, run:

```bash
./update-resume.sh
```

This copies the latest resume from `../../Documents/resumes/Manuel-Martinez-Garcia-Resume.pdf` to `assets/cv/ManuelMartinezGarciaResume2026.pdf`.

## Deployment

Push to `main` to deploy via GitHub Pages.

## Notes

- SEO metadata and Open Graph tags are set per page.
- JSON-LD Person schema is included on the homepage.
- PDF viewer on the CV page uses PDF.js.
- The sidebar email link uses a lightweight human check before opening a mailto link.
- When adding/removing pages, keep `sitemap.xml` in sync.
