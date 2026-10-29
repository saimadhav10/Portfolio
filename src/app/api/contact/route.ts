import { NextResponse } from "next/server";
import { validateContact } from "@/lib/contact";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const allowedOrigins = new Set([
    new URL(request.url).origin,
    "https://saimadhav1.runs-on.dev",
  ]);
  if (process.env.VERCEL_URL)
    allowedOrigins.add(`https://${process.env.VERCEL_URL}`);
  if (process.env.NODE_ENV === "development") {
    allowedOrigins.add("http://localhost:3000");
    allowedOrigins.add("http://127.0.0.1:3000");
  }
  if (origin && !allowedOrigins.has(origin))
    return NextResponse.json(
      { error: "Please submit the form from this website." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return NextResponse.json(
      { error: "Unsupported request." },
      { status: 415 },
    );
  if (Number(request.headers.get("content-length") || 0) > 24000)
    return NextResponse.json(
      { error: "Message is too long." },
      { status: 413 },
    );
  let data;
  try {
    const body = await request.text();
    if (body.length > 24000)
      return NextResponse.json(
        { error: "Message is too long." },
        { status: 413 },
      );
    data = validateContact(JSON.parse(body));
  } catch {
    return NextResponse.json(
      { error: "Please check your message and try again." },
      { status: 400 },
    );
  }
  if (!data)
    return NextResponse.json(
      {
        error:
          "Enter a valid name, email, and a message of 10–5,000 characters.",
      },
      { status: 400 },
    );
  if (data.website) return NextResponse.json({ ok: true });
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL)
    return NextResponse.json(
      {
        error:
          "The form is being set up. Please connect with me on LinkedIn for now.",
      },
      { status: 503 },
    );
  try {
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: data.email,
        subject: `Portfolio message from ${data.name}`,
        text: `From: ${data.name}\nReply to: ${data.email}\n\n${data.message}`,
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!result.ok)
      return NextResponse.json(
        {
          error:
            "Your message could not be delivered. Please try again or connect on LinkedIn.",
        },
        { status: 502 },
      );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "The connection timed out. Please try again shortly." },
      { status: 502 },
    );
  }
}
