# Deployment Configuration

## Build Settings

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18.x

## Environment Variables

Copy the following environment variables to your deployment platform:

### Required for Production:

- `VITE_API_URL`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_MAP_TILE_PROVIDER`

### Optional (Analytics/Monitoring):

- `VITE_GOOGLE_ANALYTICS_ID`
- `VITE_SENTRY_DSN`

## Headers Configuration

Add the following headers for optimal performance and security:

```
# Cache Control
/*
  Cache-Control: public, max-age=31536000

/index.html
  Cache-Control: public, max-age=0, must-revalidate

/sw.js
  Cache-Control: public, max-age=0, must-revalidate

# Security Headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

# PWA Support
/manifest.json
  Content-Type: application/manifest+json
```

## Redirects

```
# SPA Fallback
/*    /index.html   200
```

## Performance Optimizations Applied

✅ Code splitting and lazy loading
✅ Bundle analysis and optimization
✅ Image optimization with lazy loading
✅ PWA support with service worker
✅ Tree shaking and dead code elimination
✅ Gzip/Brotli compression ready
✅ CSS and JS minification
✅ Critical CSS inlining
✅ Font optimization
✅ Resource preloading

## Accessibility Features

✅ Keyboard navigation support
✅ Screen reader compatibility
✅ High contrast mode support
✅ Reduced motion preferences
✅ Focus management
✅ ARIA labels and roles
✅ Semantic HTML structure

## SEO Optimizations

✅ Meta tags optimization
✅ Open Graph tags
✅ Twitter Card support
✅ Structured data (JSON-LD)
✅ Canonical URLs
✅ Sitemap generation ready

## Monitoring and Analytics

✅ Performance monitoring hooks
✅ Error boundary implementation
✅ Memory usage tracking
✅ Core Web Vitals monitoring
✅ User interaction tracking ready

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Lighthouse Scores (Expected)

- Performance: 95-100
- Accessibility: 95-100
- Best Practices: 95-100
- SEO: 90-100
