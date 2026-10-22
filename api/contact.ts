interface HandlerReq {
  method?: string;
  body?: unknown;
}

interface HandlerRes {
  status(code: number): HandlerRes;
  json(payload: unknown): void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function parseBody(body: unknown): Record<string, unknown> {
  if (typeof body === "string") {
    try {
      const parsed: unknown = JSON.parse(body);
      return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  return typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
}

export default async function handler(req: HandlerReq, res: HandlerRes): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const raw = parseBody(req.body);
  const name = asString(raw.name)?.trim() ?? "";
  const email = asString(raw.email)?.trim() ?? "";
  const message = asString(raw.message)?.trim() ?? "";

  if (name.length < 1 || name.length > 100) {
    res.status(400).json({ ok: false, error: "Name must be 1-100 characters" });
    return;
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    res.status(400).json({ ok: false, error: "Invalid email" });
    return;
  }
  if (message.length < 1 || message.length > 5000) {
    res.status(400).json({ ok: false, error: "Message must be 1-5000 characters" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.status(503).json({ ok: false, error: "Email service not configured" });
    return;
  }

  const recipient = process.env.CONTACT_TO_EMAIL ?? "[EMAIL_PLACEHOLDER]";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "portfolio@resend.dev",
        to: [recipient],
        reply_to: email,
        subject: `Portfolio contact from ${name}`,
        text: `${message}\n\n— ${name} <${email}>`
      })
    });

    if (!response.ok) {
      res.status(502).json({ ok: false, error: "Email provider error" });
      return;
    }

    res.status(200).json({ ok: true });
  } catch {
    res.status(502).json({ ok: false, error: "Email provider error" });
  }
}
