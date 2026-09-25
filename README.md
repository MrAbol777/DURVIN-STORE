This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Database (MySQL / MariaDB)

Prisma reads `DATABASE_URL` from the environment. Keep the real value only in `.env.local`; never commit it. Copy the format in `.env.example` and set the connection before running database commands.

For PowerShell, load the local URL into the current command session, then run Prisma:

```powershell
$env:DATABASE_URL = ((Get-Content .env.local | Where-Object { $_ -match '^DATABASE_URL=' }) -replace '^DATABASE_URL=', '').Trim('"')
npm run db:generate
npm run db:migrate -- --name init_mysql
npm run db:seed
```

The seed is idempotent: it adds sample categories and products only when their slugs do not already exist. It never deletes records. It creates an admin only if `ADMIN_USERNAME` and `ADMIN_PASSWORD` are configured; the password is stored as an scrypt hash, never plaintext.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

### Product uploads

In development, product files are stored under `public/uploads/products` and only their public paths are saved in MySQL. This folder is not durable on most serverless hosts; production must use persistent disk or object storage while preserving the same URL contract.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# DURVIN-STORE
