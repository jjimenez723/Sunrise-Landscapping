# Sunrise-Landscapping — New Sunrise Landscape

React + Vite landing page for New Sunrise Landscape, rebuilt from the original single-file HTML concept.

## Stack

- React 19 + Vite
- Firebase Firestore for quote requests
- Fraunces + DM Sans for the page typography
- Firebase Hosting-ready config

## Run locally

```bash
npm install
npm run dev
```

The form works in local preview mode before Firebase is connected: requests are queued in `localStorage` and the form explains that behavior. This makes the design testable without pretending a production inbox is configured.

## Connect Firebase

1. Create or choose a Firebase project.
2. Register a web app in that project.
3. Copy `.env.example` to `.env` and fill in the Firebase web-app config values.
4. Deploy Firestore rules and the built site:

```bash
npx -y firebase-tools@latest use YOUR_PROJECT_ID
npx -y firebase-tools@latest deploy --only firestore:rules
npm run firebase:deploy
```

Quote submissions are stored in the `quoteRequests` collection. The included rules intentionally allow create-only access from the public site and block reads, updates, and deletes from the browser. Before a high-volume launch, add Firebase App Check and/or route writes through a trusted server endpoint to reduce spam.

## Project shape

- `src/App.jsx` — page sections, interactions, gallery, mobile drawer, form state
- `src/styles.css` — responsive visual system and typography
- `src/lib/firebase.js` — environment-based Firebase initialization
- `src/services/leads.js` — Firestore write with local development fallback
- `firestore.rules` — create-only quote request rules
