# Trucking Logistics Hub

have create a website for logistic company with trucks

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9418b10e-b194-4797-aced-7dec99d8cc3c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## SEO configuration

SEO URLs default to the live domain `https://www.adlamlogistics.co.zw`. If you deploy to a different domain, set `VITE_SITE_URL` in your deploy environment or Lovable Secrets to override it. It drives canonical URLs, Open Graph URLs, structured data, `sitemap.xml`, and `robots.txt`. See `.env.example`.

The site serves:

- `/sitemap.xml` — all public pages with absolute canonical URLs and a `lastmod` date.
- `/robots.txt` — allows all crawlers and points to the sitemap.

When published content changes, update `SITE_LAST_MODIFIED` in `src/lib/seo.ts` so the sitemap gives crawlers an accurate recrawl signal.

### Get Google to pick up changes faster

1. Deploy with `VITE_SITE_URL` set to the live HTTPS domain.
2. Confirm `https://www.adlamlogistics.co.zw/robots.txt` and `https://www.adlamlogistics.co.zw/sitemap.xml` load in a browser.
3. Add and verify the property in [Google Search Console](https://search.google.com/search-console).
4. Open **Sitemaps**, submit `sitemap.xml`, and check that it reports **Success**.
5. Use **URL Inspection** on the home page and any changed page, then click **Request indexing**.

Google cannot be forced to index instantly, but these steps give it the cleanest and fastest crawl path. A sitemap submission in Search Console is the main trigger; adding the sitemap to `robots.txt` alone is not enough for fast discovery.
