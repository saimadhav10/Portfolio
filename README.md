<div align="center">

# Sai Madhav

Computer Science student. Fascinated by data and numbers.

[Visit portfolio](https://saimadhav1.runs-on.dev) · [LinkedIn](https://www.linkedin.com/in/saimadhav1) · [GitHub](https://github.com/saimadhav10)

</div>

---

A personal portfolio with an interactive particle portrait, selected projects, technical skills, a downloadable résumé, and a private contact form. Built with JetBrains Mono, subtle motion, and responsive layouts.

## Selected projects

| Project                                                    | What it does                                                               |
| ---------------------------------------------------------- | -------------------------------------------------------------------------- |
| [Pookalam.io](https://github.com/saimadhav10/pookalam-io)  | Real-time multiplayer drawing game inspired by Onam.                       |
| [COCTracker](https://github.com/saimadhav10/COCTracker)    | Offline-first Android companion for village progress and upgrade planning. |
| [GameReviews](https://github.com/saimadhav10/game-reviews) | Community game ratings, reviews, and discussions.                          |

## Stack

Next.js · React · TypeScript · SCSS · Three.js · GSAP · Lenis

Hosted on Vercel. Contact messages are delivered through Resend.

## Run locally

Requires Node.js 22+ and npm.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

For contact-form delivery, copy `.env.example` to `.env.local` and configure:

| Variable             | Purpose                          |
| -------------------- | -------------------------------- |
| `RESEND_API_KEY`     | Resend sending API key           |
| `CONTACT_TO_EMAIL`   | Private receiving inbox          |
| `CONTACT_FROM_EMAIL` | Resend-authorized sender address |

Keep credentials in ignored environment files locally and Vercel environment settings in production. The portfolio runs without them; email delivery requires configuration.

## Maintain

- **Projects and skills:** `src/lib/content.ts`. Project artwork lives in `src/app/page.tsx`.
- **About and layout:** `src/app/page.tsx`.
- **Portrait:** `public/images/sai-madhav.jpg` and `src/components/ParticlePortrait.tsx`.
- **Résumé:** `public/Sai-Madhav-Resume.pdf` and `public/images/resume-preview.png`.

Before publishing changes, run `npm test`, `npm run typecheck`, and `npm run build`. Import this repository into Vercel with the Next.js preset; connected deployments follow pushes to `main`.

---

Visual inspiration: [Daniel Ingrassia](https://ingrassiadaniel.it/). JetBrains Mono includes its license in `public/fonts`. COCTracker artwork credits are available in [its repository](https://github.com/saimadhav10/COCTracker).
