// src/lib/api.ts
const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BASE) {
  // This will show up in your browser console if the env var is missing in Vercel
  console.error("Missing NEXT_PUBLIC_BACKEND_URL in Production env");
}

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function askBackend(messages: ChatMessage[]) {
  const url = `${BASE}/ask`;
  console.log("POST", url); // verify in DevTools console
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Backend ${res.status}: ${text}`);
  }
  return res.json() as Promise<{ answer: string }>;
}
