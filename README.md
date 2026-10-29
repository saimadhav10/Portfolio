# Sai Madhav — Portfolio

A dark portfolio featuring a photo-based particle portrait, Pookalam.io and COCTracker, education, skills, a résumé, and a private contact form. Built with Next.js, React, TypeScript, SCSS, Three.js, Lenis, and GSAP. Visual direction inspired by [Daniel Ingrassia](https://ingrassiadaniel.it/); implementation is original.

## Run locally

Use Node.js 22 LTS or newer and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The page and résumé work without email credentials. The form returns an explicit setup message until configured.

```sh
npm test
npm run typecheck
npm run build
```

## Deploy free on Vercel

1. Sign in to [Vercel](https://vercel.com/new) with GitHub and import `saimadhav10/Portfolio`.
2. Select Next.js and leave the root directory at the repository root. Default build and output settings are sufficient.
3. Add the three server-side environment variables below in Project Settings → Environment Variables. Never use a `NEXT_PUBLIC_` prefix for secrets.
4. Deploy. Future pushes to `main` deploy automatically once the Git integration is connected.
5. In Project Settings → Domains, add `saimadhav1.runs-on.dev`. At the provider managing that subdomain, enter the **exact DNS records shown by Vercel**. Resolve conflicting records for the same hostname as instructed by the provider. Wait for domain verification and HTTPS. Do not change the parent `runs-on.dev` zone.
6. Open the custom domain, check both projects and the résumé, then submit a real contact message to confirm delivery.

Vercel's Hobby plan is intended for personal, non-commercial projects and has usage limits. See [Hobby documentation](https://vercel.com/docs/plans/hobby).

## Private email delivery with Resend

Create a [Resend](https://resend.com/) account and verify a sending domain you control, following its DNS instructions. If your subdomain provider does not support the required records, use another verified sending domain or another email provider before enabling the form.

Set these values directly in Vercel's environment settings, then redeploy:

| Variable             | Value                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`     | A Resend API key restricted to sending email, ideally scoped to your verified domain  |
| `CONTACT_TO_EMAIL`   | Your private inbox that receives enquiries                                            |
| `CONTACT_FROM_EMAIL` | A sender on your verified domain, e.g. `Sai Portfolio <contact@your-verified-domain>` |

For local testing, put the same variables in `.env.local` and restart the dev server. `.env*` is ignored except the blank `.env.example`. Keep keys out of chat, source files, and Git. Revoke and replace any exposed key.

The server validates inputs, uses the visitor's email as Reply-To, rejects cross-origin browser requests, includes a honeypot, and reports errors without pretending delivery succeeded. This application does not store messages; Resend processes the submitted name, email, and message. Configure a Vercel firewall rate-limit rule for POST `/api/contact` before a public launch to protect the email quota. The honeypot is basic filtering, not a distributed rate limiter.

## Update content

- Projects and skills: `src/lib/content.ts`. When adding projects, also update the count and introductory copy in `src/app/page.tsx`.
- About and education: `src/app/page.tsx`.
- Résumé: replace `public/Sai-Madhav-Resume.pdf`. The editable generator is `scripts/create_resume.py`, requiring Python and ReportLab.
- Portrait: `public/images/portrait-reference.png` is the supplied visual reference, not Sai's actual photograph. The effect is a 2.5D point cloud, not a scanned or fully rotating 3D head. Update the silhouette path in `src/components/Portrait.tsx` when replacing the image.
- COCTracker's screenshot comes from [its repository](https://github.com/saimadhav10/COCTracker); Supercell owns the game artwork. See that project's credits. Pookalam's preview is a CSS illustration.

No analytics or tracking cookies are included. Motion respects reduced-motion preferences. A static portrait fallback is available when WebGL cannot initialize.

## Verification

Production build, TypeScript checks, and contact validation tests are provided above. Live email delivery requires your own credentials and a real deployment; mocked provider tests never send email.
