# Food Bridge

**Feed families, not landfills.** Food Bridge is a web marketplace that connects food vendors who have surplus meals with nearby buyers, who can claim them at a discount and pick them up.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS, Framer Motion
- [Appwrite](https://appwrite.io) for auth, database and file storage

## Getting started

```bash
npm install
cp .env.example .env   # fill in your Appwrite project values
npm run dev
```

### Appwrite setup

Create a project with:

- **Database** with collections for `listings`, `orders` and `vendor_profiles`
- **Storage buckets** for food images and business documents
- Your app URL added as a Web platform (needed for email verification and password reset links)

Put the IDs in `.env` (see `.env.example`).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

## Project structure

```
src/
  pages/
    marketing/   Public site (home, about, vendors, individuals, contact)
    auth/        Login, sign-up, email verification, password reset
    app/         Buyer app (listings, cart, orders, saved, profile)
    app/vendor/  Vendor dashboard and listing management
  components/    Shared UI, layouts and page sections
  services/      Appwrite calls (auth, listings, orders)
  context/       App-wide state (user, cart, saved items)
  lib/appwrite.ts  Appwrite client and resource IDs
```

## Team

- Sultanat Bashir, Akinnibi Adesewa (frontend)
- Najib Sholadoye, Oyewole AbdulSamad (backend)
