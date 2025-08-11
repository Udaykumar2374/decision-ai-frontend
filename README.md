  # Decidely Dashboard (Next.js 14 + TypeScript + Tailwind + shadcn/ui)

  A modern SaaS dashboard UI for **Decidely**. Connects to a FastAPI backend for AI answers and uses Firebase (Auth + Firestore) for user sessions.

  ---

  ## 1) Prerequisites

  - Node.js 18+ and npm
  - Git + GitHub account
  - Firebase project (Auth + Firestore enabled)
  - (Optional) Vercel account for hosting

  ---

  ## 2) Environment Variables

  Create `./.env.local`:

  \`\`\`env
  # Firebase (client-side)
  NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_KEY
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
  NEXT_PUBLIC_FIREBASE_APP_ID=...

  # Backend base URL (local or deployed)
  NEXT_PUBLIC_BACKEND_API=http://localhost:8000

  # (Optional) NextAuth / Google OAuth if you wire it up later
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=replace_me
  GOOGLE_CLIENT_ID=replace_me
  GOOGLE_CLIENT_SECRET=replace_me
  \`\`\`

  > Keep `.env.local` out of git (already ignored by default).

  ---

  ## 3) Install & Run

  \`\`\`bash
  npm install
  npm run dev
  \`\`\`

  - App will run on `http://localhost:3000`.

  Build & start production:

  \`\`\`bash
  npm run build
  npm run start
  \`\`\`

  ---

  ## 4) Project Structure

  \`\`\`
  app/
    layout.tsx
    page.tsx
    globals.css
    login/page.tsx
    dashboard/page.tsx
    about/page.tsx
    faq/page.tsx
    profile/page.tsx
    settings/page.tsx
    help/page.tsx
  components/
    ui/...
    theme-provider.tsx
    theme-toggle.tsx
    dashboard/
      sidebar.tsx
      chat-interface.tsx
      user-profile.tsx
  lib/
    utils.ts
  \`\`\`

  ---

  ## 5) Wiring the Backend

  Use `NEXT_PUBLIC_BACKEND_API` when calling your API from components:

  \`\`\`ts
  const base = process.env.NEXT_PUBLIC_BACKEND_API;
  const res = await fetch(\`\${base}/ask\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, context, sessionId }),
  });
  const data = await res.json();
  \`\`\`

  Recommended message shape for the UI:

  \`\`\`ts
  interface DecisionSession {
    id: string;
    title: string;
    timestamp: string; // ISO
    messages: Array<{
      id: string;
      type: "question" | "response";
      content: string;
      context?: string;
    }>;
  }
  \`\`\`

  ---

  ## 6) Firebase Setup (Quick)

  - Enable **Authentication** → **Google** provider.
  - Create **Firestore** (in Production mode).
  - Suggested rules for dev:

  \`\`\`js
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /users/{userId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
  \`\`\`

  ---

  ## 7) Deploy (Vercel)

  1. Push to GitHub.
  2. Import repo in **Vercel** → select the frontend folder root.
  3. Set **Environment Variables** (same as `.env.local`).
  4. Deploy → you’ll get `https://decidely.vercel.app` (example).

  ---

  ## 8) Troubleshooting

  - **CORS errors**: ensure backend allows your Vercel domain.
  - **Firebase “insufficient permissions”**: check auth state and Firestore rules.
  - **Blank page in prod**: verify all env vars are set in Vercel.
  - **404s to API**: confirm `NEXT_PUBLIC_BACKEND_API` points to the correct URL (Render or local).

  ---

  ## 9) Scripts

  \`\`\`json
  {
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint"
    }
  }
  \`\`\`

  ---

  ## 10) License

  MIT (or your choice)
