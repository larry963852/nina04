import { NextResponse } from "next/server";

export async function POST() {
  try {
    await fetch("https://ntfy.sh/nina04-valentine-2026", {
      method: "POST",
      body: "Brenny dijo que sí xd",
      headers: { "Content-Type": "text/plain" },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
