# Multi-Domain Deployment Guide

This app supports multiple domains, each serving different competition data. It is deployed on [Vercel](https://vercel.com).

## Supported Domains

- `results.ol-dm.de` - German Championship orienteering events
- `results.hamburg-ol.de` - Hamburg orienteering events

Requests are routed by `middleware.ts`, which reads the `Host` header, checks it against the supported-domain list, and sets an `x-domain` header used to select the right content for the rest of the request.

## Deploying to Vercel

Deployments are git-push-driven: pushing to `main` builds and promotes to production, and every other branch or pull request gets its own preview deployment. No server or process manager to manage.

For a manual deploy from the CLI:

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

### Environment Variables

No additional environment variables are required for domain detection.

## Adding a Custom Domain

1. In the Vercel project, go to **Settings → Domains** and add the domain.
2. Point DNS at Vercel:
   - Subdomain (e.g. `results.ol-dm.de`) → `CNAME` record to `cname.vercel-dns.com`
   - Apex domain (e.g. `ol-dm.de`) → `A` record to `76.76.21.21`
3. Vercel verifies the domain once DNS propagates and issues a TLS certificate automatically, renewing it before expiry. There is no Certbot step and nothing to renew manually.

Both domains currently in use are subdomains, so both use the CNAME form above.

## Preview Deployments

Every branch and pull request gets a unique `*.vercel.app` preview URL. There are no redirects: the middleware treats `localhost`, `127.0.0.1`, `::1`, `*.local`, `*.localhost`, and `*.vercel.app` as development hosts and serves them the default domain's content (`results.hamburg-ol.de`, set as `DEFAULT_DOMAIN` in `lib/data.ts`) directly on that preview URL, rather than rendering a preview of an actual production hostname. Genuinely unknown public hosts (anything else not in the supported-domain list) get no `x-domain` header and render the "Domain nicht unterstützt" page instead.

## Adding a New Event Domain

The set of supported domains and their competition data lives in `lib/data.ts`, in the `DOMAIN_CONFIGS` object. Adding a domain is a single edit:

1. Add an entry to `DOMAIN_CONFIGS` in `lib/data.ts`.
2. Add a custom domain in Vercel and point DNS at it (see above).
3. Redeploy (a normal git push is sufficient).

`SUPPORTED_DOMAINS` is derived as `Object.keys(DOMAIN_CONFIGS)`, so there's no separate allowlist to keep in sync — it cannot drift from the data.

Each competition has `startTime` and `endTime` (no separate `date` field — the displayed date is derived from `startTime`). Both must be ISO 8601 timestamps with an explicit UTC offset, e.g. `"2026-05-23T12:00:00+02:00"`. Use Germany's actual offset for that date: `+02:00` during CEST (late March to late October), `+01:00` during CET (winter). Omitting the offset or using the wrong one makes the "Aktiv" badge fire at the wrong wall-clock time.

## Verifying a Deployment

Check that each domain renders its own content:

```bash
curl -s https://results.ol-dm.de | grep -o '<title>[^<]*</title>'
curl -s https://results.hamburg-ol.de | grep -o '<title>[^<]*</title>'
```

Each domain should show a distinct title and its own competition list, not a shared/default one.

## Caching

The middleware sets `Cache-Control: public, max-age=0, s-maxage=300, stale-while-revalidate=3600` on every response. This lets Vercel's CDN absorb race-day traffic spikes — up to 5 minutes of edge caching (`s-maxage=300`), with stale content served for up to an hour while it revalidates in the background — while `max-age=0` keeps browsers from holding onto stale HTML themselves. Vercel's cache key includes the request host, so `results.ol-dm.de` and `results.hamburg-ol.de` never serve each other's cached HTML. This matters most exactly when it's needed: on race day, when the app gets the bulk of its traffic.

## Troubleshooting

- **Domain shows the wrong event / default content**: Check the domain's entry in `DOMAIN_CONFIGS` (`lib/data.ts`), and confirm DNS for that host actually resolves to Vercel (`dig` the hostname and check for the CNAME/A record above).
- **Domain not verified in Vercel**: Check **Settings → Domains** for a pending/error status — usually a DNS record that's missing, wrong, or not yet propagated.
- **Preview URL shows the wrong content**: Expected if the host isn't `*.vercel.app`, `localhost`, or another recognized development host — see Preview Deployments above. Otherwise check the middleware logic and `isDevelopmentHost`/`isSupportedDomain` in `lib/data.ts`.
