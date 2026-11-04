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

Features: mobile swipe galleries; desktop gallery arrows; keyboard gallery controls; expandable descriptions; status filtering; device-local saved works. Artwork enquiries use a shared Formspree modal, with the selected title and ID included automatically. Submissions never change availability or create reservations or notification subscriptions.

## Hosting

Deploy to a Node-compatible Next.js host. Add `pricelist.dawidzynda.com` to the host's custom domain settings, then use the DNS records supplied by that host and enable HTTPS. No DNS or production deployment was performed. The draft is deliberately marked `noindex`; change metadata in `src/app/layout.tsx` when ready for public discovery. Noindex is not access control.

## Next phase

Add an email provider, server-side OTP challenge storage with expiry, attempt limits and rate limits, and a secure HttpOnly 30-day session cookie. Gate catalogue routes and data on the server. Store explicit newsletter consent separately from access permission. Add persisted availability requests. None of these services are enabled in this MVP.

## Languages

The header switcher supports Polish, English and French, and remembers the selection locally. Interface messages live in `src/data/i18n.ts`. Artwork content lives in `src/data/artworks.ts`: `medium` and `description` each contain `{ PL: "...", EN: "...", FR: "..." }`. `src/data/artwork-translations.ts` resolves those records to display strings. Blank translations fall back to English, then Polish, then French; wholly empty fields stay empty. Titles are preserved as entered. Set `prices: { PLN: 8000, EUR: 1850 }` independently; null displays “Price on request”. No automatic currency conversion is performed. Language switching is client-side, without separate localized URL routes.

## Preparing artwork photographs

See `scripts/PHOTOS.md` for the non-destructive batch resize/rename workflow, colour handling, responsive variants and quality review. Run its tests with `python3 scripts/test_prepare_photos.py`.

## Enquiries — Formspree setup

1. Create an account at https://formspree.io and verify your email address.
2. In the dashboard, create a new form (for example, **Artwork enquiries**). Set and verify the email address that should receive enquiries.
3. Copy the form ID from the integration endpoint: for `https://formspree.io/f/abcdefgh`, the ID is `abcdefgh` (this is an example, not a working ID).
4. Copy `.env.example` to `.env.local` if you do not already have that file. Set `NEXT_PUBLIC_FORMSPREE_FORM_ID` to your real ID. Keep existing environment settings intact.
5. Restart `npm run dev`. For deployment, add the same variable in your hosting environment and rebuild/redeploy; Next.js embeds public environment variables at build time.

The form ID is public, not a secret. Do not put an API key here. `.env.local` is ignored by Git. Without a configured ID, sending is disabled and an unavailable notice is shown. An incorrect or inactive ID produces an error, never a success message.

The React integration submits inline. The `email` field supplies the visitor's Reply-To address; `message` starts empty and is optional. `artwork_title` and `artwork_id` are attached to every submission. Sending locks the form and modal dismissal until completion, and a successful form cannot be resubmitted. Failed requests preserve the visitor's input for retry. After setup, send a test enquiry and check both the Formspree dashboard and your inbox, then reply to confirm the visitor's email is used.
