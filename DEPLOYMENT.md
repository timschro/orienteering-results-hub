# Multi-Domain Deployment Guide

This app supports multiple domains with different competition data for each domain.

## Supported Domains

- `results.ol-dm.de` - German Championship orienteering events
- `results.hamburg-ol.de` - Hamburg orienteering events

## Deployment Setup

### 1. Domain Configuration

Each domain should point to the same application instance. The app will automatically detect the domain and serve the appropriate content.

### 2. Environment Variables

No additional environment variables are required for domain detection.

### 3. DNS Configuration

Configure your DNS to point both domains to your hosting provider:

```
results.ol-dm.de     A     <your-server-ip>
results.hamburg-ol.de A     <your-server-ip>
```

### 4. Web Server Configuration

#### Nginx Example

```nginx
server {
    listen 80;
    server_name results.ol-dm.de results.hamburg-ol.de;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Apache Example

```apache
<VirtualHost *:80>
    ServerName results.ol-dm.de
    ServerAlias results.hamburg-ol.de
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    RequestHeader set X-Forwarded-Proto "http"
    RequestHeader set X-Forwarded-Port "80"
</VirtualHost>
```

### 5. SSL/HTTPS Setup

Use Let's Encrypt or your preferred SSL provider to secure both domains:

```bash
# Let's Encrypt with Certbot
certbot --nginx -d results.ol-dm.de -d results.hamburg-ol.de
```

### 6. Application Deployment

Deploy the application as usual. The middleware will automatically handle domain detection and routing.

## Adding New Domains

To add a new domain:

1. Add the domain to `lib/domains.ts` in the `SUPPORTED_DOMAINS` array
2. Add domain configuration to `lib/domains.ts` in the `DOMAIN_CONFIGS` object
3. Add competition data to `lib/data.ts` in the `domainConfigs` object
4. Update DNS and web server configuration
5. Deploy the updated application

## Testing

You can test the multi-domain setup locally by:

1. Adding entries to your `/etc/hosts` file:
   ```
   127.0.0.1 results.ol-dm.de
   127.0.0.1 results.hamburg-ol.de
   ```

2. Running the development server:
   ```bash
   npm run dev
   ```

3. Visiting both domains in your browser to verify different content is served.

## Troubleshooting

- **Domain not detected**: Check that the middleware is running and the `x-domain` header is being set
- **Wrong competitions shown**: Verify the domain configuration in `lib/data.ts`
- **SSL issues**: Ensure both domains are included in your SSL certificate 