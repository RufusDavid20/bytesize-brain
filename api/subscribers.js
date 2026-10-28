import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const expectedToken = process.env.SUBSCRIBER_DASHBOARD_TOKEN;
  const authHeader = req.headers.authorization || "";
  const suppliedToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!expectedToken || !suppliedToken || suppliedToken.length !== expectedToken.length) {
    return res.status(401).json({ error: "Unauthorized." });
  }
  // Constant-time comparison to avoid leaking token prefix matches.
  let mismatch = 0;
  for (let i = 0; i < expectedToken.length; i++) mismatch |= expectedToken.charCodeAt(i) ^ suppliedToken.charCodeAt(i);
  if (mismatch !== 0) return res.status(401).json({ error: "Unauthorized." });

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return res.status(503).json({ error: "Database isn't configured." });

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { count, error: countError } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact", head: true });
  if (countError) return res.status(500).json({ error: "Unable to retrieve subscriber count." });

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("email, subscribed_at")
    .order("subscribed_at", { ascending: false })
    .limit(500);
  if (error) return res.status(500).json({ error: "Unable to retrieve subscribers." });

  return res.status(200).json({ count: count || 0, subscribers: data || [] });
}
