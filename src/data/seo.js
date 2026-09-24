import {
  businessName,
  email,
  faqs,
  phoneHref,
  portfolio,
  postalAddress,
  services,
  siteUrl,
  socialLinks,
  towns,
} from "./site.js";

export const pageTitle = "Landscaping in North Plainfield, NJ | New Sunrise Landscape";
export const pageDescription =
  "New Sunrise Landscape offers lawn care, landscape design, paver patios and retaining walls in North Plainfield and Central New Jersey. Request a free estimate.";

const absoluteUrl = (path) => new URL(path, siteUrl).href;
const businessId = absoluteUrl("#business");
const websiteId = absoluteUrl("#website");
const pageId = absoluteUrl("#webpage");
const serviceAreas = towns.map((name) => ({
  "@type": "Place",
  name: `${name}, New Jersey`,
}));
const profiles = socialLinks.filter((link) => link.isProfile).map((link) => link.url);

// Use the same facts and FAQ answers as the visible page. Review snapshots are
// deliberately not advertised as current aggregate ratings in structured data.
export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HomeAndConstructionBusiness",
      "@id": businessId,
      name: businessName,
      url: siteUrl,
      description: pageDescription,
      telephone: phoneHref.replace("tel:", ""),
      email,
      address: { "@type": "PostalAddress", ...postalAddress },
      areaServed: serviceAreas,
      image: portfolio.map(({ image }) => absoluteUrl(image)),
      logo: absoluteUrl("/favicon.svg"),
      ...(profiles.length ? { sameAs: profiles } : {}),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: phoneHref.replace("tel:", ""),
        email,
        url: absoluteUrl("#contact"),
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Landscaping and outdoor living services",
        itemListElement: services.map(({ id }) => ({
          "@type": "Offer",
          itemOffered: { "@id": absoluteUrl(`#service-${id}`) },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: siteUrl,
      name: businessName,
      inLanguage: "en-US",
      publisher: { "@id": businessId },
    },
    {
      "@type": "WebPage",
      "@id": pageId,
      url: siteUrl,
      name: pageTitle,
      description: pageDescription,
      inLanguage: "en-US",
      isPartOf: { "@id": websiteId },
      about: { "@id": businessId },
      hasPart: { "@id": absoluteUrl("#faq") },
    },
    ...services.map(({ id, title, description, image }) => ({
      "@type": "Service",
      "@id": absoluteUrl(`#service-${id}`),
      name: title,
      serviceType: title,
      description,
      image: absoluteUrl(image),
      url: absoluteUrl(`#service-${id}`),
      provider: { "@id": businessId },
      areaServed: serviceAreas,
    })),
    {
      "@type": "FAQPage",
      "@id": absoluteUrl("#faq"),
      url: absoluteUrl("#faq"),
      isPartOf: { "@id": pageId },
      mainEntity: faqs.map(({ id, question, answer }) => ({
        "@type": "Question",
        "@id": absoluteUrl(`#faq-${id}`),
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export function seoHeadTags() {
  const meta = (key, name, content) => ({
    tag: "meta",
    attrs: { [key]: name, content },
    injectTo: "head",
  });
  const image = absoluteUrl(portfolio[0].image);

  return [
    { tag: "title", children: pageTitle, injectTo: "head" },
    meta("name", "description", pageDescription),
    meta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1"),
    { tag: "link", attrs: { rel: "canonical", href: siteUrl }, injectTo: "head" },
    meta("property", "og:type", "website"),
    meta("property", "og:locale", "en_US"),
    meta("property", "og:site_name", businessName),
    meta("property", "og:title", pageTitle),
    meta("property", "og:description", pageDescription),
    meta("property", "og:url", siteUrl),
    meta("property", "og:image", image),
    meta("property", "og:image:width", "1024"),
    meta("property", "og:image:height", "768"),
    meta("property", "og:image:alt", portfolio[0].alt),
    meta("name", "twitter:card", "summary_large_image"),
    meta("name", "twitter:title", pageTitle),
    meta("name", "twitter:description", pageDescription),
    meta("name", "twitter:image", image),
    meta("name", "twitter:image:alt", portfolio[0].alt),
    {
      tag: "script",
      attrs: { type: "application/ld+json" },
      children: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
      injectTo: "head",
    },
  ];
}

export const robotsTxt = `# Public pages are accessible to search and AI search crawlers.
User-agent: *
Allow: /

# ChatGPT search discovery (independent of model-training controls).
User-agent: OAI-SearchBot
Allow: /

Sitemap: ${absoluteUrl("/sitemap.xml")}
`;

export const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}</loc></url>
</urlset>
`;
