# manpazito.github.io

Personal portfolio site for Manuel Martinez Garcia, UCLA Master's student in Transportation Engineering, hosted on GitHub Pages.

Live at: https://manpazito.github.io

## Structure

```
/projects/      - Engineering and research projects
/projects/*/    - Individual project detail pages
/cv/            - Resume (PDF viewer)
/contact/       - Contact form

/assets/css/    - Global stylesheet
/assets/img/    - Images and icons
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

## Deployment

Push to `main` to deploy via GitHub Pages.

## Notes

- SEO metadata and Open Graph tags are set per page.
- JSON-LD Person schema is included on the homepage.
- PDF viewer on the CV page uses PDF.js.
- Contact form is handled via Formspree with reCAPTCHA v3.
- When adding/removing pages, keep `sitemap.xml` in sync.
