// src/lib/api.ts
const BASE = process.env.NEXT_PUBLIC_BACKEND_URL!; // e.g. https://decision-ai-backend.onrender.com

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function askBackend(messages: ChatMessage[]) {
  const res = await fetch(`${BASE}/ask`, {
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
