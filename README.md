# New Sunrise Landscape

React + Vite site for New Sunrise Landscape in North Plainfield, New Jersey.

## Run locally

```bash
npm install
npm run dev
```

Production build: `npm run build`. Preview the build: `npm run preview`.

## Site experience

- Full-width backyard hero with an integrated headline.
- Four-photo gallery with arrows, dot navigation, native touch scrolling, and an enlarged photo viewer. The portfolio viewer supports arrow keys and Escape.
- Six-step consultation wizard directly after the ratings strip, inspired by Stone Bellisimo’s form: project, town, name, phone, email, then review. Answers persist when moving Back or editing; Who We Are follows the form. Contact hours and phone details sit beneath the wizard.
- Service cards and footer services preselect the requested service. Town links prefill the town.
- Branded, lazily loaded MapLibre location map with Google directions to the published home-base address. The map retains the upstream worker-bundling fix and shows a directions fallback if it cannot load.
- Six attributed review highlights with Google source branding and a link to the original reviews. Google wordmark and G assets are hosted locally from Google’s gstatic branding assets.
- Larger “How can we help?” chat button and guided automated chat for services, areas, hours, pricing questions, and consultation details. The visitor reviews the completed form before sending.
- Responsive navigation, mobile call/quote actions, keyboard focus, reduced-motion support, local photography, and local fonts.
- Facebook and WhatsApp links in the footer and mobile navigation, plus an accessible FAQ section that also works without JavaScript.

## Search and AI discovery

`npm run build` builds the client and then renders the entire homepage into `dist/index.html`. Visitors and crawlers receive the same content without needing JavaScript; React hydrates that HTML to enable the existing interactive features. Use the full build command, not `vite build` alone. `npm run preview` previews this production behavior; the development server still uses client rendering.

- `src/data/seo.js` generates the page title, description, canonical URL, Open Graph and Twitter sharing metadata, and JSON-LD for the local business, six services, and visible FAQs.
- `src/data/site.js` is the shared source for the canonical domain, business contact details, service areas, verified social links, services, and FAQ answers. The canonical domain is the existing `https://newsunriselandscape.com/`; update `siteUrl` before building if the production domain changes.
- The build generates `dist/robots.txt` and `dist/sitemap.xml`. Search crawlers are allowed, including an explicit rule for ChatGPT's `OAI-SearchBot`. The sitemap lists the real homepage URL, not its section fragments.
- Social previews use an actual business project photo. Structured data excludes the historical review snapshot. Hours are also omitted from structured data until the owner reconciles the conflicting hours on the original homepage and contact page.
- The [Facebook page](https://www.facebook.com/p/New-Sunrise-Lawn-Care-LLC-100083555731353/) was supplied by the user on September 24, 2026; direct Facebook retrieval was throttled. WhatsApp is verified from the original site's published number. Instagram remains unconfirmed. Add confirmed profiles to `socialLinks` with `isProfile: true`; they appear in the page links and the business's `sameAs` metadata. WhatsApp is a messaging link, not a claimed identity profile.

The implementation follows [OpenAI's crawler documentation](https://developers.openai.com/api/docs/bots) and [Google's guidance for generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide). Crawl access, useful content, and consistent business information support discovery; they do not guarantee indexing or a position in AI answers. FAQ markup describes the visible answers and makes no promise of a Google rich result. No special AI text file is required for Google search visibility.

After deploying to the production domain, submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools, inspect the homepage's indexing status, and verify that the host/CDN allows legitimate search crawlers. Keep the website, Google Business Profile, Bing Places, and confirmed social profiles consistent. Reconcile business hours with the owner and update review counts from a current source. These account and hosting actions are not performed by the local build.

Run `npm run test:seo` to check the generated HTML, schema/content consistency, asset references, and crawler files.

## Lead delivery

Without Firebase configuration, the form prepares a request and offers **Email my request** and **Text my request**. These open the visitor's own app with the details filled in. The visitor must press Send there. The site does not claim a request was delivered in this mode. Local drafts are best-effort and limited to the latest 20; they are not automatically synchronized or sent later.

Chat is a guided assistant, not a live operator or a general AI service. It collects the same fields as the form, validates them, and transfers them for review. It shares the form's delivery path and tags requests with `source: "chatbot"`.

To enable direct submissions:

1. Create or choose a Firebase project and register a web app.
2. Copy `.env.example` to `.env` and set the Firebase web-app config values.
3. Deploy the included Firestore rules to that project.
4. Rebuild the site.

Configured submissions create documents in the `quoteRequests` collection. A success message appears only after Firestore acknowledges the write. Failures preserve the visitor's details and offer an email/call alternative. Firestore storage does **not** send email notifications; an owner inbox or notification workflow must be connected separately. The Firebase SDK loads only when a configured form is submitted.

## Content sources

Business contact details, hours (Monday–Saturday, 7 AM–7 PM), service areas, project photos, and review highlights were checked against [the original website](https://newsunriselandscape.com/) on September 23, 2026. The displayed 5.0 rating and 54-review count are a snapshot of its review widget, not a live Google feed. Review cards use short excerpts and clearly labeled summaries.

`public/images/project-*.jpg` come from the original site's `/wp-content/uploads/2026/07/` gallery. The numeric filenames preserve the original gallery order. `original-logo.png` is retained as a reference. The new SVG mark combines its sun, birds, and green landscape with the site's simpler visual style.

The existing hero photo was retained at the user's request and downloaded from [Unsplash](https://images.unsplash.com/photo-1600585154340-be6161a56a0c). It is an aspirational hero image; the project galleries use images from the business's original site. DM Sans and Fraunces are hosted locally, with their OFL license files in `public/fonts`.

## Project structure

- `src/App.jsx` — section order, navigation, services, portfolio, map, reviews, footer
- `src/components/ContactForm.jsx` — validation and delivery states
- `src/components/ChatAssistant.jsx` — guided chat and form handoff
- `src/components/Gallery.jsx` — four-photo carousel and native dialog viewer
- `src/components/Brand.jsx` — SVG identity and interface icons
- `src/components/LocationMap.jsx`, `BrandMap.jsx`, and `BrandMap.css` — lazy map loading, branded map, and map presentation
- `src/data/site.js` — business details, photos, review highlights, shared validation
- `src/styles.css` — responsive styles
- `src/services/leads.js` — Firestore delivery and local draft fallback
- `src/lib/firebase.js` — configuration and deferred SDK loading
- `firestore.rules` — create-only quote request rules
