export const businessName = "New Sunrise Landscape";
export const siteUrl = "https://newsunriselandscape.com/";
export const phone = "(908) 319-6763";
export const phoneHref = "tel:+19083196763";
export const email = "info@newsunriselandscape.com";
export const postalAddress = {
  streetAddress: "301 Maple Ave #244",
  addressLocality: "North Plainfield",
  addressRegion: "NJ",
  postalCode: "07060",
  addressCountry: "US",
};
export const address = `${postalAddress.streetAddress}, ${postalAddress.addressLocality}, ${postalAddress.addressRegion} ${postalAddress.postalCode}`;
// Facebook was supplied by the user; WhatsApp comes from the original site's
// published number. Add Instagram only when its profile URL is confirmed.
export const socialLinks = [
  {
    id: "facebook",
    label: "Facebook",
    url: "https://www.facebook.com/p/New-Sunrise-Lawn-Care-LLC-100083555731353/",
    action: "Visit New Sunrise Lawn Care LLC on Facebook",
    isProfile: true,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    url: "https://wa.me/19083196763",
    action: "Message New Sunrise Landscape on WhatsApp",
    isProfile: false,
  },
];
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
export const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=m&z=14&output=embed`;
export const reviewsUrl =
  "https://newsunriselandscape.com/#:~:text=Our%20Clients%20Love%20Us";
export const towns = [
  "North Plainfield",
  "Plainfield",
  "South Plainfield",
  "Warren",
  "Watchung",
  "Short Hills",
  "Fanwood",
  "Scotch Plains",
  "Westfield",
];

export const services = [
  {
    id: "patios",
    title: "Hardscaping & Paver Patios",
    description:
      "Patios, walkways, and steps. A beautiful foundation for life outdoors.",
    image: "/images/project-05.jpg",
    className: "service-card--large",
  },
  {
    id: "lawn",
    title: "Lawn Care & Maintenance",
    description: "Thoughtful, regular care for a lawn you love coming home to.",
    image: "/images/project-02.jpg",
    className: "service-card--wide",
  },
  {
    id: "design",
    title: "Landscape Design",
    description: "A fresh perspective on your outdoor space.",
    image: "/images/project-10.jpg",
  },
  {
    id: "walls",
    title: "Retaining Walls",
    description: "Structure, character, and lasting craftsmanship.",
    image: "/images/project-12.jpg",
  },
  {
    id: "planting",
    title: "Tree, Shrub & Mulch",
    description:
      "Neat hedges, fresh planting, and the finishing touches that matter.",
    image: "/images/project-07.jpg",
    className: "service-card--wide",
  },
  {
    id: "cleanup",
    title: "Spring & Fall Cleanup",
    description: "A fresh start for your yard, season after season.",
    image: "/images/project-03.jpg",
    className: "service-card--wide",
  },
];
export const serviceOptions = [
  ...services.map((service) => service.title),
  "Something else",
];

export const faqs = [
  {
    id: "service-area",
    question: "Which New Jersey towns do you serve?",
    answer: `New Sunrise Landscape is based in North Plainfield, NJ. We serve ${towns.join(", ")}. If your property is nearby, include your town in a consultation request so the team can confirm availability.`,
  },
  {
    id: "landscaping-services",
    question: "What landscaping and hardscaping services do you offer?",
    answer:
      "We offer lawn care and maintenance, landscape design, paver patios and walkways, retaining walls, tree and shrub care, mulch, and spring and fall cleanups. Tell us whether you need ongoing yard care or have a new outdoor project in mind.",
  },
  {
    id: "free-estimates",
    question: "Are consultations and estimates free?",
    answer:
      "Yes. New Sunrise Landscape offers free consultations and estimates. Pricing depends on your property and the work involved, so the team will discuss your project before providing a quote.",
  },
  {
    id: "property-types",
    question: "Do you work on residential and commercial properties?",
    answer:
      "Yes. We provide landscaping, hardscaping, and outdoor living services for homeowners and commercial properties throughout our Central New Jersey service area.",
  },
  {
    id: "request-consultation",
    question: "How do I request a landscaping consultation?",
    answer: `Use the consultation form on this page, or call, text, or WhatsApp ${phone}. Share your town, the service you need, and a few details about your property so the team can discuss next steps.`,
  },
];

export const portfolio = [
  {
    title: "A greener welcome home",
    category: "Lawn care",
    image: "/images/project-02.jpg",
    alt: "Freshly striped lawn at a New Sunrise Landscape client's home",
  },
  {
    title: "A path worth coming home to",
    category: "Pavers & walkways",
    image: "/images/project-05.jpg",
    alt: "Completed paver walkway beside a lawn and front porch",
  },
  {
    title: "Room for a little more color",
    category: "Garden beds & planting",
    image: "/images/project-10.jpg",
    alt: "Freshly mulched garden bed with flowering shrubs and small plants",
  },
  {
    title: "Beautiful from the ground up",
    category: "Stonework & retaining walls",
    image: "/images/project-12.jpg",
    alt: "Stone retaining wall and steps surrounding a planted garden",
  },
  {
    title: "The details make the difference",
    category: "Shrub care & mulch",
    image: "/images/project-07.jpg",
    alt: "Trimmed foundation shrubs with a tidy mulch bed",
  },
  {
    title: "A new season starts here",
    category: "Seasonal cleanup",
    image: "/images/project-03.jpg",
    alt: "New Sunrise Landscape truck and leaf cleanup in progress",
  },
];

// Short excerpts and editorial summaries of reviews displayed on the original site.
// The rating/count are a snapshot of that site's Google review widget, not a live feed.
export const testimonials = [
  {
    name: "Gail N.",
    quote: "He truly does excellent work",
    summary:
      "Gail praised Luis’s dependable arrival, yard work, and lawn care.",
  },
  {
    name: "JG Cordova",
    quote: "Job was done fast",
    summary: "JG recommends the team for prompt service and lawn care.",
  },
  {
    name: "Craig Forman",
    quote: "Reliable and fairly priced.",
    summary: "Craig appreciated the quality of the work and its value.",
  },
  {
    name: "Deborah Ferreira",
    quote: "Luis was great!",
    summary:
      "Deborah highlighted a reasonably priced yard cleanup and plans to hire Luis again.",
  },
  {
    name: "Wilson Knapp",
    quote: "they went above and beyond!",
    summary:
      "Wilson valued the thorough leaf removal, mowing, and care for his property.",
  },
  {
    name: "Christina Ryan",
    quote: "Highly recommend!!!",
    summary:
      "Christina praised the crew’s care and found Luis easy to work with.",
  },
];

export const emptyRequest = {
  name: "",
  phone: "",
  email: "",
  service: "",
  town: "",
  message: "",
};

export function validateField(name, value) {
  const text = value.trim();
  if (name === "name" && text.length < 2) return "Please enter your name.";
  if (name === "phone") {
    const digits = text.replace(/\D/g, "");
    if (!/^\d{10}$/.test(digits) && !/^1\d{10}$/.test(digits))
      return "Please enter a 10-digit US phone number.";
  }
  if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text))
    return "Please enter a valid email address.";
  if (name === "town" && text.length < 2) return "Please enter your town.";
  if (name === "service" && !serviceOptions.includes(text))
    return "Please choose a service.";
  return "";
}

export function requestLinks(data) {
  const body = `Hello New Sunrise Landscape,\nI'd like a free consultation.\n\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nService: ${data.service}\nTown: ${data.town}\nProject details: ${data.message || "Let's discuss my project."}`;
  return {
    email: `mailto:${email}?subject=${encodeURIComponent(`Consultation request — ${data.service}`)}&body=${encodeURIComponent(body)}`,
    sms: `sms:+19083196763?body=${encodeURIComponent(body)}`,
  };
}
