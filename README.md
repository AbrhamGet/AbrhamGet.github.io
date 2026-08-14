# Abrham Getaneh — Portfolio Site

A single-page site: hero, a scrolling proof ticker, about, skills, six case studies
(Habtambet, One Mobile, Orbit Electronics, Techno Z Engineering, SAF Home Decor,
and TM Coffee for international work), a campaign spotlight with real creative,
a work experience timeline, certifications, previous institutional clients, a
reach section, and contact.

Three items, no build step: `index.html`, `styles.css`, and the `assets/` folder
(logos and campaign images — keep this folder alongside the other two files).

## Host it free on GitHub Pages

1. Go to [github.com](https://github.com) and sign in (or create a free account).
2. Click the **+** in the top right → **New repository**.
3. Name it exactly `abrhamgetaneh.github.io` (this exact pattern gives you a clean
   URL — replace `abrhamgetaneh` with your own GitHub username if it's different).
   Set it to **Public**. Don't add a README when prompted — you already have one.
4. On the new repo's page, click **Add file → Upload files**, then drag in
   `index.html`, `styles.css`, **and the whole `assets` folder** from this folder.
   Commit the changes.
5. Go to the repo's **Settings → Pages**. Under "Build and deployment," set
   **Source** to "Deploy from a branch," branch `main`, folder `/ (root)`. Save.
6. Wait 1–2 minutes, then your site is live at `https://abrhamgetaneh.github.io`.

Any time you want to update the site, just re-upload the changed file(s) on
GitHub (or use `git push` if you're comfortable with git) — it redeploys
automatically within a minute or two.

## Alternative: Netlify (drag-and-drop, no GitHub needed)

1. Go to [netlify.com](https://netlify.com) and sign up free.
2. On the dashboard, drag this whole folder onto the "Deploy manually" drop zone.
3. Netlify gives you a live URL instantly (like `abrham-getaneh.netlify.app`),
   and you can rename it for free in Site settings → Change site name.

## Editing later

- All text lives directly in `index.html` — search for the section you want
  (marked with HTML comments like `<!-- CASE STUDIES -->`) and edit the text.
- Colors, fonts, and spacing live in `styles.css` under `:root` at the top.
