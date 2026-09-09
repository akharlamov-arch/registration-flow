# Deployment — nginx static server

The app is a Vite + React SPA using `HashRouter`. All routing is hash-based so nginx
never sees sub-routes — only requests for static assets and `index.html`.

The Vite config sets `base: '/registration-flow/'`, which means every asset URL is
prefixed with `/registration-flow/` and the app must be served from that subpath on
the target server.

---

## 1. Set production environment variables

Vite bakes env vars into the bundle at build time. Create a `.env.production` file
in the project root (do **not** commit it):

```bash
# .env.production
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_UPLOAD_LAMBDA_URL=https://<id>.lambda-url.us-east-1.on.aws/
```

`VITE_PLAID_STEP5_ENABLED` and `VITE_PLAID_COMBINED_LINK_ENABLED` are no longer read
by the app (Plaid linking was replaced with ACH direct verification) and can be omitted.

---

## 2. Build

```bash
npm ci
npm run build
```

Output lands in `dist/`. Verify it looks right:

```
dist/
  index.html
  assets/
    index-<hash>.js
    index-<hash>.css
    ...
```

---

## 3. Copy the bundle to the server

Replace `user@server` and the target path to match your setup.

```bash
rsync -avz --delete dist/ user@server:/var/www/html/registration-flow/
```

The `--delete` flag removes stale assets from previous deploys (important because
Vite filenames are content-hashed).

If `rsync` is not available, use `scp`:

```bash
scp -r dist/* user@server:/var/www/html/registration-flow/
```

---

## 4. Nginx configuration

The `dist/` contents must be served under `/registration-flow/` to match the Vite
`base` setting. Place the following inside your `server {}` block:

```nginx
location /registration-flow/ {
    root /var/www/html;
    # Serve static assets directly; fall back to index.html for anything else.
    # The app uses HashRouter so the browser never requests a sub-route URL,
    # but this ensures a direct hit to the base path always gets index.html.
    try_files $uri $uri/ /registration-flow/index.html;

    # Cache hashed assets indefinitely; never cache index.html
    location ~* \.(?:js|css|woff2?|svg|jpg|png|webp|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    location = /registration-flow/index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

The `root` directive keeps file resolution simple: a request for
`/registration-flow/assets/index-abc.js` maps to
`/var/www/html/registration-flow/assets/index-abc.js`.

---

## 5. If the API is on a different origin (CORS / reverse proxy)

If `VITE_API_BASE_URL` points to the same nginx host, add a proxy pass to avoid
CORS preflight:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:4000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

In that case set `VITE_API_BASE_URL=` (empty string) so API calls use the same origin.

---

## 6. Validate and reload nginx

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 7. Verify

```
https://yourdomain.com/registration-flow/          → LeadForm
https://yourdomain.com/registration-flow/#/registration → OtpVerification
```

Check the browser console and network tab for any 404s on assets (usually means a
mismatch between the `base` path and the nginx `root`/`location` path).

---

## Quick checklist

- [x] `.env.production` created with correct `VITE_API_BASE_URL`
- [x] `npm ci && npm run build` ran without errors
- [x] `dist/` copied to `/var/www/html/registration-flow/` on server
- [x] Nginx `location /registration-flow/` block in place
- [x] `nginx -t` passes, nginx reloaded
- [x] App loads and OTP flow reaches the bank step without console errors
