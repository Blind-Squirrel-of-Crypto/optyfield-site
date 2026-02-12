# OptyField Marketing Website

Built with **Next.js 14** for deployment on **Vercel**.

## Quick Start (Local Development)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Deploy to Vercel

### 1. Push to GitHub

```bash
# In this project folder, run:
git init
git add .
git commit -m "Initial commit - OptyField marketing site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/optyfield-site.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **"Import Project"**
3. Select the `optyfield-site` repo
4. Click **Deploy** (Vercel auto-detects Next.js)

### 3. Connect Your Domain

1. In Vercel dashboard → your project → **Settings** → **Domains**
2. Add `optyfield.com`
3. Vercel provides DNS records — add them in Namecheap:
   - **A Record**: Host `@`, Value `76.76.21.21`
   - **CNAME Record**: Host `www`, Value `cname.vercel-dns.com`
4. SSL is automatic

## Configuration

Edit the `CONFIG` object at the top of `app/page.js`:

```js
const CONFIG = {
  SHOW_BOOK_DEMO: true,        // Show/hide "Book a Demo" buttons
  SHOW_PRICING: true,           // Show/hide Pricing page
  PRICING_COMING_SOON: true,    // Pricing page shows "coming soon"
  CONTACT_EMAIL: "hello@optyfield.com",
  PHONE: "281-932-9345",
  FORMSPREE_ID: "xojnjowo",    // Contact form submissions
};
```

## Pages

- `/` — Home (hero, features, AI demo, verticals, CTA)
- `Features` — 8 platform modules deep dive
- `Pricing` — Coming soon (toggle-ready)
- `About` — Origin story
- `Contact` — Demo request form (Formspree-powered)
- `Privacy` — Privacy Policy (needed for App Store)
- `Terms` — Terms of Service

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Google Fonts (DM Sans + Space Mono)
- Inline SVG brand logos
- Formspree for contact form
- Deployed on Vercel
