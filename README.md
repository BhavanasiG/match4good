## Getting Started

### Running the dev server

Install dependencies first: `npm i`!

#### Updating

Check if there are any updates available: `npm outdated`. Update packages using `npm update`.

**NOTE:** New package releases could break functionality. Run intially with exisiting packages and then run application with updated packages (create a pull request/issue if new package relase breaks funcitonalty).

#### Launching the server

You need a running Postgres instance: a connection at `localhost:5432` is expected.
How this is done is up to you, either directly or in a docker container.
An easy way to get this running is with `docker run -p 5432:5432 -e POSTGRES_PASSWORD=prisma -d postgres`.

Then, run the following command to deploy the database schema, seed it with sample data, and start the webserver:
`npm run dev:setup`

This command will first ensure your database schema is up-to-date (`npm run db:deploy`), then populate it with sample data (`npx prisma db seed`), and finally start the Next.js development server (`npm run dev`).

### Making a production build

To run the deployment, use `docker compose up`.
It should just work :)
