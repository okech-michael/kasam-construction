# Ka'sam Construction Enterprise

An Express and EJS website for Ka'sam Construction Enterprise, backed by PostgreSQL on Supabase.

## Requirements

- Node.js 24 and npm
- A Supabase project with PostgreSQL enabled

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set `DATABASE_URL` to the PostgreSQL connection string from your Supabase dashboard. For Vercel/serverless deployment, use Supabase's transaction pooler connection string and keep `sslmode=require`.

3. Create the database tables and indexes:
   ```bash
   npm run migrate
   ```

4. Preserve data from the included SQLite database by importing it into a fresh Supabase database:
   ```bash
   npm run import:sqlite
   ```

   If you are not importing the bundled SQLite data, use `npm run seed` to add the starter team members and testimonials instead. Avoid running both commands because seeding adds testimonial rows.

5. Start the development server:
   ```bash
   npm run dev
   ```

The app also runs the idempotent schema setup on startup. Keep `DATABASE_URL` and `SESSION_SECRET` private; never commit production credentials.

## Supabase and Vercel deployment

1. Create a Supabase project and copy its PostgreSQL connection string. Use the transaction pooler for Vercel serverless functions.
2. In Vercel project settings, add `DATABASE_URL` and a strong `SESSION_SECRET` for the production environment.
3. Deploy the application.
4. Run `npm run migrate` once with the production `DATABASE_URL` to create the schema. If transferring the bundled SQLite content, run `npm run import:sqlite` from a local environment with that same connection string before relying on the production database.

The application uses TLS with certificate verification for its PostgreSQL connection. Use a Supabase-provided connection string with SSL enabled.

## Database

The schema includes services, projects, team members, testimonials, machine hires, contact messages, and consultation bookings. SQL queries are parameterized in `src/models/index.js`; table and index creation is in `src/db/index.js`.

## Routes

- `GET /` - Home page
- `GET /services` - Services listing
- `GET /projects` - Projects and machine hire
- `GET /about` - Team information
- `GET /contact` - Contact form
- `POST /contact` - Submit a contact message or consultation booking

## Commands

```bash
npm run dev       # Start development server
npm start         # Start production server
npm run migrate   # Create/update database schema
npm run import:sqlite # Import the bundled SQLite data
npm run seed      # Add starter team members and testimonials
npm run build     # Project build check
```

## Project structure

- `src/db/` - PostgreSQL pool and schema initialization
- `src/models/` - Parameterized SQL queries
- `src/controllers/` - Express request handlers
- `src/routes/` - Route definitions
- `views/` - EJS templates
- `static/` - CSS, JavaScript, and images
- `scripts/` - Migration, seeding, and SQLite import utilities
