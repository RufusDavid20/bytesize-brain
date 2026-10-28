ByteSize Brain — complete static website package
================================================

WHAT'S INCLUDED
- index.html: complete responsive homepage and first newsletter issue
- assets/bytesize-brain-comic-hero.png: the ByteSize Brain comic artwork
- vercel.json: small Vercel configuration

IMPORTANT
This is a complete standalone website package. It does not include your existing site's original source code or any private dashboard credentials. If you deploy this as a new Vercel project, it will be a new project until you connect your domain to it. To replace the current live site, deploy these files to the existing Vercel project or switch the domain only after you are happy with the preview.

DEPLOY TO VERCEL
1. Download and unzip this package.
2. In Vercel, open the project you want to use.
3. For the most reliable workflow, put these files in a GitHub repository and import that repository into Vercel, or use Vercel CLI from this folder:
   npm i -g vercel
   vercel
   vercel --prod
4. Preview the site before assigning/changing production domain settings.

This is a static site; no build command or framework install is required. The navigation links work, and the first newsletter is included on the page. The “share” button currently jumps to the issue section; it does not send email or publish to a mailing list.


TEAM CHARACTER UPDATE
The Team section now includes a banner crop of Bit and Bytes from the screenshot supplied by the site owner.
\n\nRESPONSIVE BLACK + RED REDESIGN\n- Uses the supplied comic panel as the hero artwork.\n- Uses a black, white and red visual theme.\n- Adds a mobile navigation toggle and responsive layout rules.\n
NEWSLETTER SUBSCRIPTIONS — BACKEND SETUP REQUIRED
=================================================
The subscription form and private admin dashboard are included. For real signups, connect a Supabase database and configure Vercel environment variables.

1. Create/use a Supabase project for ByteSize Brain (avoid reusing an unrelated project unless you intend to).
2. In Supabase SQL Editor, run schema.sql.
3. In Vercel Project Settings > Environment Variables, set:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY (server-side only; never add to client-side code)
   - SUBSCRIBER_DASHBOARD_TOKEN (a long random secret)
4. Install dependencies (npm install) and deploy this folder to Vercel.
5. Test a signup. Then visit /admin.html and enter the SUBSCRIBER_DASHBOARD_TOKEN to see the total and latest 500 emails.

IMPORTANT
- Until Supabase and Vercel environment variables are configured, the form will display a setup/unavailable error and will not pretend that a subscriber was saved.
- The thank-you message and quote appear on the website after the API confirms the email was stored.
- This version does not send a separate confirmation email to the subscriber. It shows the thank-you message in the browser. Sending an email to their inbox requires connecting an email provider and should be added after the storage flow is working.
- The dashboard endpoint is protected by a server-side token. Keep the token and service role key private.
- Consider adding double opt-in, a privacy policy, and an unsubscribe workflow before sending recurring marketing emails.

EPISODE 001 COMIC PAGE
======================
- The "Learn the 3 safety checks" button now opens /episode-001.html.
- The Episodes navigation and Read Issue CTA open the dedicated episode page.
- The supplied full comic image is stored at assets/episode-001-delivery-scam.png.
- Episode page uses the black, white, and red brand style and includes responsive layout and safety tips.

OCTOBER 2026 SIGNUP FIX
=======================
The subscribe API uses the Supabase publishable key and the RLS insert policy, rather than requiring a service-role key just to save signups. This means the service-role key must NOT be added to Vercel for the public signup flow. The Vercel project needs SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY, already configured in the connected project during this support session. Redeploy this updated code to activate the fix.

The admin dashboard endpoint in this package still requires a separately configured SUPABASE_SERVICE_ROLE_KEY and SUBSCRIBER_DASHBOARD_TOKEN. Do not expose the service-role key in client-side code. The admin dashboard won't work until that private admin configuration is added.
