## Getting Started

### Running the dev server

Install dependencies first: `npm i`!

#### Updating

Check if there are any updates available: `npm outdated`. Update packages using `npm update`.

**NOTE:** New package releases could potentially break functionality. It is recommended to initially run the application with existing packages. After confirming functionality, you can run the application with updated packages. If a new package release breaks functionality, please create a pull request or issue to report it.

#### Launching the server

You need a running Postgres instance: a connection at `localhost:5432` is expected.
How this is done is up to you, either directly or in a docker container.
An easy way to get this running is with:

    ```
    docker run -p 5432:5432 -e POSTGRES_PASSWORD=prisma -d postgres
    ```

Once your database is running, you have two options to start the development server:

1.  **Full Setup (Deploy, Seed, Start Server):** Run this command for the initial setup, after a database reset, or whenever you need to refresh your database with sample data.

    ```bash
    npm run dev:setup
    ```

    This command will first ensure your database schema is up-to-date (`npm run db:deploy`), then populate it with sample data using the seed script (`npx prisma db seed`), and finally start the Next.js development server (`npm run dev`).

2.  **Server Only (Start Server):** Run this command if your database is already deployed and seeded, and you just need to start or restart the web server process.

    ```bash
    npm run dev
    ```

### Making a production build

To run the deployment, use `docker compose up`.
It should just work :)
