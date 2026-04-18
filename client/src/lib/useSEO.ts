import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}

const BASE_URL = "https://theworldofwine.org";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;
const SITE_NAME = "The World of Wine";

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Sets page title, meta description, Open Graph, and Twitter card tags.
 * Call in each page/component with page-specific content.
 */
export function useSEO({ title, description, path, image, type = "website" }: SEOProps) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
    const url = path ? `${BASE_URL}${path}` : BASE_URL;
    const img = image || DEFAULT_IMAGE;

    // Title
    document.title = fullTitle;

    // Meta description
    setMeta("description", description);

    // Open Graph
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:url", url, true);
    setMeta("og:image", img, true);
    setMeta("og:type", type, true);
    setMeta("og:site_name", SITE_NAME, true);

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", img);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    return () => {
      // Reset to defaults when unmounting (optional, prevents stale meta)
      document.title = `${SITE_NAME} — Your Journey Through Wine`;
    };
  }, [title, description, path, image, type]);
}

/**
 * Injects JSON-LD structured data into the page head.
 * Removes previous script on re-render.
 */
export function useStructuredData(data: Record<string, unknown>) {
  useEffect(() => {
    const id = "structured-data-ld";
    let script = document.getElementById(id) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => { script.textContent = ""; };
  }, [JSON.stringify(data)]);
}
