# manpazito.github.io

Personal portfolio site for Manuel Martinez Garcia, hosted on GitHub Pages.

Live at: https://manpazito.github.io

## Structure

```
/               - Home (about, research)
/projects/      - Engineering and research projects
/projects/*/    - Individual project detail pages
/cv/            - CV and resume (PDF viewer)
/contact/       - Contact form
/assets/css/    - Global stylesheet
/assets/img/    - Images and icons
/assets/cv/     - CV and resume PDFs
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

## Updating the CV and resume

Run `./update-resume.sh` to copy `Manuel-Martinez-Garcia-CV.pdf` and
`Manuel-Martinez-Garcia-Resume.pdf` from `../../Documents/resumes` relative to the
repository. The script uses Poppler’s `pdfinfo` to check both files before
replacing the site copies. Pass a source directory as the first argument to override
the default.

## Deployment

Push to `main` to deploy via GitHub Pages.

## Notes

- SEO metadata and Open Graph tags are set per page.
- JSON-LD Person schema is included on the homepage.
- PDF viewer on the CV page uses PDF.js.
- Contact form is handled via Formspree with reCAPTCHA v3.
- When adding/removing pages, keep `sitemap.xml` in sync.
