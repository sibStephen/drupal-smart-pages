# Drupal + Next.js + OPEN AI Integration

A boilerplate for a decoupled Drupal + Next.js application using GPT-4 for AI-generated content.

## Tech Stack
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Drupal (JSON:API enabled)
- OpenAI GPT-4 API
- React Markdown Editor

## 🔧 Getting Started

1. Install dependencies (Note - Please use node version 20 or install nvm if needed to switch between the version.)

```bash
npm install
```

2. Create a `.env.local` file:

```
DRUPAL_BASE_URL=https://your-drupal-site.com
OPENAI_API_KEY=sk-xxxxxx
```

3. Run the dev server:

```bash
npm run dev
```

Visit:
- `http://localhost:3000` → AI summary page
- `http://localhost:3000/editor` → Markdown editor

## Deploy on Vercel

1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Set environment variables under Project → Settings → Environment Variables
5. Click Deploy!

Vercel will auto-detect the Next.js app and build it.

---
Made with ❤️ by Sibu Stephen