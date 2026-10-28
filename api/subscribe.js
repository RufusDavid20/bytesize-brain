const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const body = req.body || {};
  // Honeypot field: silently ignore bot submissions.
  if (typeof body.website === "string" && body.website.trim()) {
    return res.status(200).json({ ok: true });
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (email.length > 254 || !emailPattern.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !publishableKey) {
    return res.status(503).json({
      error: "Subscriptions aren't connected yet. Please try again later."
    });
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/newsletter_subscribers?on_conflict=email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": publishableKey,
          "Authorization": `Bearer ${publishableKey}`,
          "Prefer": "resolution=ignore-duplicates,return=representation"
        },
        body: JSON.stringify({ email, source: "website" })
      }
    );

    if (!response.ok) {
      // Log only status, never email addresses or credentials.
      console.error("Newsletter signup failed with Supabase status:", response.status);
      return res.status(500).json({
        error: "We couldn't save your subscription. Please try again shortly."
      });
    }

    const inserted = await response.json().catch(() => []);
    const alreadySubscribed = !Array.isArray(inserted) || inserted.length === 0;
    return res.status(200).json({ ok: true, alreadySubscribed });
  } catch (error) {
    console.error("Newsletter signup request failed.");
    return res.status(502).json({
      error: "The subscription service is temporarily unavailable. Please try again."
    });
  }
}
