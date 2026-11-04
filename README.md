# Dawid Zynda — price list

Next.js App Router + React + TypeScript. Local MVP, with no authentication or database required.

## Run

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000. Production: `npm run build` then `npm start`.

## Catalogue

Edit `src/data/artworks.ts`. Each record contains an ID, title, year, dimensions, multilingual medium, PLN/EUR prices, status, multilingual description and ordered images. Supported statuses: `available`, `reserved`, `exhibition`, `sold`. Put real artwork photographs in `public/artworks` and use paths such as `/artworks/my-work.jpg`.

Features: mobile swipe galleries; desktop gallery arrows; keyboard gallery controls; expandable descriptions; status filtering; device-local saved works. Enquiry and availability buttons currently show an honest preview notice and offer to save the work. They do not send mail, create reservations, or register notification requests.

## Hosting

Deploy to a Node-compatible Next.js host. Add `pricelist.dawidzynda.com` to the host's custom domain settings, then use the DNS records supplied by that host and enable HTTPS. No DNS or production deployment was performed. The draft is deliberately marked `noindex`; change metadata in `src/app/layout.tsx` when ready for public discovery. Noindex is not access control.

## Next phase

Add an email provider, server-side OTP challenge storage with expiry, attempt limits and rate limits, and a secure HttpOnly 30-day session cookie. Gate catalogue routes and data on the server. Store explicit newsletter consent separately from access permission. Add persisted availability requests and real enquiry delivery. None of these services are enabled in this MVP.

## Languages

The header switcher supports Polish, English and French, and remembers the selection locally. Interface messages live in `src/data/i18n.ts`. Artwork content lives in `src/data/artworks.ts`: `medium` and `description` each contain `{ PL: "...", EN: "...", FR: "..." }`. `src/data/artwork-translations.ts` resolves those records to display strings. Blank translations fall back to English, then Polish, then French; wholly empty fields stay empty. Titles are preserved as entered. Set `prices: { PLN: 8000, EUR: 1850 }` independently; null displays “Price on request”. No automatic currency conversion is performed. Language switching is client-side, without separate localized URL routes.

## Preparing artwork photographs

See `scripts/PHOTOS.md` for the non-destructive batch resize/rename workflow, colour handling, responsive variants and quality review. Run its tests with `python3 scripts/test_prepare_photos.py`.
