This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Install dependencies first: `npm i`!

You need a running Postgres instance: a connection at `localhost:5432` is expected.
How this is done is up to you, either directly or in a docker container.
An easy way to get this running is with `docker run -p 5432:5432 -e POSTGRES_PASSWORD=prisma -d postgres`.
Then run `npm run db:deploy` to modify the database to the current schema.
Finally run `npm run dev` to actually run the webserver.

## Deploy

To run the deployment, use `docker compose up`.
It should just work :)
