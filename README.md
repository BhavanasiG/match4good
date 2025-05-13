## Getting Started

### Running the dev server

Install dependencies first: `npm i`!

#### Updating

Check if there are any updates available: `npm outdated`. Update packages using `npm update`.

**NOTE:** New package releases could potentially break functionality. It is recommended to initially run the application with existing packages. After confirming functionality, you can run the application with updated packages. If a new package release breaks functionality, please create a pull request or issue to report it.

#### Generating documentation from TSDoc

To manually generate HTML documentation from TSDoc comments:

    npm run docs

This will output static HTML files to the docs/ directory.

To auto-regenerate docs every time you save a file (while working on the codebase), use:

    npm run docs:watch

This watches your source files and automatically updates the generated docs in docs/ on change.

To preview the generated documentation locally in your browser:

    npm run docs:serve

This starts a local static server at http://localhost:5000 and serves the docs/ folder so you can browse the documentation.

#### Launching the server

You need a running Postgres instance: a connection at `localhost:5432` is expected.
How this is done is up to you, either directly or in a docker container.
An easy way to get this running is with:

    docker run -p 5432:5432 -e POSTGRES_PASSWORD=prisma -d postgres

Once your database is running, you can use one of the following **single commands** to perform the full setup (deploy schema, seed database, and start the development server):

1. **Start Dev Server with Minimal Data Setup:** Resets your database (dropping all existing data), applies the latest schema migrations, seeds only the essential data (Regions, Categories), and starts the development server. Use this for a clean database setup without example data.

   ```bash
   npm run start:dev:minimal
   ```

2. **Start Dev Server with Full Example Data Setup:** Resets your database (dropping all existing data), applies the latest schema migrations, seeds essential data _plus a full set of example data_ (users, organizations, listings, applications, etc.), and starts the development server. Use this for a database setup with sample data for development and testing:

   ```bash
   npm run start:dev:full
   ```

Alternatively, if your database schema is already deployed and seeded (using one of the start:dev: commands above, or by running npm run db:deploy and a npm run seed: command individually), you can just start the development server _without resetting the database_:

    ```npm run dev```

### Making a production build

To run the deployment, use:

    docker compose up

It should just work :)
