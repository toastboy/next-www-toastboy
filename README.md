# Next.js + MySQL rewrite of www.toastboy.co.uk

This project is based on [Azure + MySQL example code](https://github.com/Azure-Samples/vercel-nextjs-app-azure-db-mysql) from [Prisma](https://www.prisma.io/) using [Tailwind CSS](https://tailwindcss.com/) for styling.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)

## Set up the Next.js app

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) to bootstrap:

```bash
npx create-next-app next-www-toastboy
```

## MySQL connection string

The environment variable `DATABASE_URL` needs to be set to the correct connection string in `.env`, which includes the URL and the credentials. For now I'm using the debug localhost database:

```text
DATABASE_URL=mysql://root:{mysqlpassword}@127.0.0.1/footy
```

Naturally, since it's sensitive it's marked as ignored in `.gitignore`.

## Push the schema into the database

The original example has seed data which can be written into the database using a seed script. I'll revisit that approach for testing, but for now I have used [[Prisma]] introspection to generate a schema directly from what's already in the database (see Obsidian for notes on the data tidying that was needed)

## Run the App

Run the app with following command:

```shell
npm run dev
```

Open your browser at [localhost:3000](localhost:3000) to see the running application.
