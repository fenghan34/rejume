# Rejume

**Rejume** (pronounced _reh-joo-meh_, inspired by the Japanese word レジュメ) is an AI-powered resume builder that helps you craft professional resumes.

## Features

- ✨ **AI Suggestions** – Receive personalized edits and improvements
- 📝 **Live Markdown Editor** – Write and preview in real time
- 💬 **Chat Assistant** – Get contextual help while writing
- 💾 **Auto-Save** – Never lose your work

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: PostgreSQL, Drizzle ORM, Better Auth
- **AI**: Vercel AI SDK, OpenRouter
- **Editor**: Monaco Editor

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+
- [Supabase CLI](https://supabase.com/docs/guides/local-development#quickstart)
- OpenRouter API key

### Setup

1. **Clone and install**

   ```bash
   git clone https://github.com/fenghan34/rejume.git
   cd rejume
   pnpm install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure `.env.local` with your own values.

3. **Start local database and run migrations**

   ```bash
   supabase start
   pnpm db:migrate
   ```

4. **Start the development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

[MIT](LICENSE)
