import { useEffect } from "react";

function SEOHead({
  title = "Waypoint - Track Your Journey",
  description = "Track your outdoor runs, walks, and rides with purpose. Beautiful GPS tracking with advanced analytics.",
  keywords = "GPS tracking, running, fitness, outdoor activities, route tracking",
  canonicalUrl,
  ogImage = "/og-image.jpg",
  twitterCard = "summary_large_image",
}) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    updateMetaTag("description", description);

    // Update meta keywords
    updateMetaTag("keywords", keywords);

    // Open Graph tags
    updateMetaProperty("og:title", title);
    updateMetaProperty("og:description", description);
    updateMetaProperty("og:image", ogImage);
    updateMetaProperty("og:type", "website");
    updateMetaProperty("og:site_name", "Waypoint");

    // Twitter Card tags
    updateMetaProperty("twitter:card", twitterCard);
    updateMetaProperty("twitter:title", title);
    updateMetaProperty("twitter:description", description);
    updateMetaProperty("twitter:image", ogImage);

    // Canonical URL
    if (canonicalUrl) {
      updateCanonicalUrl(canonicalUrl);
    }

    // JSON-LD structured data
    updateStructuredData({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Waypoint",
      description: description,
      url: window.location.origin,
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    });
  }, [title, description, keywords, canonicalUrl, ogImage, twitterCard]);

  return null; // This component doesn't render anything
}

function updateMetaTag(name, content) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateMetaProperty(property, content) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateCanonicalUrl(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;
}

function updateStructuredData(data) {
  let script = document.querySelector('script[type="application/ld+json"]');
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export default SEOHead;
