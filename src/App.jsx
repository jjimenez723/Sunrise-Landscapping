import { useEffect, useRef, useState } from "react";
import Brand, { Arrow, Check } from "./components/Brand";
import { ProjectGallery, Lightbox } from "./components/Gallery";
import ContactForm from "./components/ContactForm";
import ChatAssistant from "./components/ChatAssistant";
import SocialLinks from "./components/SocialLinks";
import Faq from "./components/Faq";
import LocationMap from "./components/LocationMap";
import { storeCoordinates } from "./data/company";
import {
  address,
  directionsUrl,
  email,
  phone,
  phoneHref,
  portfolio,
  reviewsUrl,
  services,
  testimonials,
  towns,
} from "./data/site";

const navigation = [
  ["Services", "services"],
  ["Portfolio", "portfolio"],
  ["Areas We Serve", "areas"],
  ["Reviews", "reviews"],
  ["Contact", "contact"],
];

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [prefill, setPrefill] = useState(null);
  const mobileDialog = useRef(null);
  const closeMobile = () => setMobileOpen(false);
  const selectRequest = (fields) =>
    setPrefill({ ...fields, sequence: Date.now() });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 150);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const dialog = mobileDialog.current;
    if (mobileOpen) dialog.showModal();
    else dialog.close();
  }, [mobileOpen]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header
        className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}
      >
        <div className="shell nav-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map(([label, id]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <a href="#contact" className="button button--dark button--small">
              Free Quote <Arrow />
            </a>
            <button
              className="menu-button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <dialog
        className="mobile-drawer"
        id="mobile-navigation"
        ref={mobileDialog}
        aria-label="Mobile navigation"
        onCancel={closeMobile}
      >
        <div className="mobile-drawer__top">
          <Brand onClick={closeMobile} />
          <button
            className="round-button"
            onClick={closeMobile}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <nav className="mobile-nav" aria-label="Mobile">
          {navigation.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={closeMobile}>
              {label}
              <Arrow />
            </a>
          ))}
        </nav>
        <div className="mobile-drawer__actions">
          <a href={phoneHref} className="button button--outline">
            Call {phone}
          </a>
          <a
            href="#contact"
            className="button button--dark"
            onClick={closeMobile}
          >
            Request a free consultation
          </a>
          <SocialLinks />
        </div>
      </dialog>

      <main id="main">
        <section className="hero" id="top">
          <img
            className="hero__image"
            src="/images/hero.jpg"
            alt="A beautifully designed backyard with a green lawn, mature tree, and outdoor living space"
            fetchPriority="high"
            width="2200"
            height="1467"
          />
          <div className="hero__shade" />
          <div className="shell hero__content">
            <h1>
              Outdoor spaces,
              <br />
              <span>beautifully</span> built.
            </h1>
            <p className="hero__lead">
              Custom patios, healthy lawns, and a little more life outdoors.
              Landscaping and hardscaping in North Plainfield and across Central
              New Jersey.
            </p>
            <div className="button-row">
              <a href="#contact" className="button button--cream">
                Request free consultation <Arrow />
              </a>
              <a href="#portfolio" className="text-link text-link--light">
                Explore our work <Arrow />
              </a>
            </div>
          </div>
          <div className="shell hero__bottom">
            <span>Good mornings begin outdoors.</span>
            <a href="#featured-projects">
              Take a look around <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <div id="featured-projects">
          <ProjectGallery onOpen={setActiveImage} />
        </div>
        <section className="stats" aria-label="New Sunrise at a glance">
          <div className="shell stats-grid">
            {[
              ["5.0★", "Google Rating"],
              ["54", "Google Reviews"],
              ["9", "NJ Towns Served"],
              ["Mon–Sat", "7 AM – 7 PM"],
            ].map(([value, label]) => (
              <div className="stat" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <ContactForm prefill={prefill} />

        <section className="section section--about" id="about">
          <div className="shell about-grid">
            <div className="image-frame image-frame--about">
              <img
                src="/images/project-00.jpg"
                alt="A New Sunrise crew member carefully installing a paver walkway"
                loading="lazy"
                width="768"
                height="1024"
              />
              <span className="image-note">
                Local roots.
                <br />
                Lasting care.
              </span>
            </div>
            <div className="about-copy">
              <div className="eyebrow">Who We Are</div>
              <h2>
                Distinctive outdoor living, <i>done right.</i>
              </h2>
              <p>
                We believe your outdoor space should feel like an extension of
                home. A place to slow down, gather your favorite people, and
                enjoy what’s right outside your door.
              </p>
              <p>
                Based in North Plainfield, New Sunrise Landscape brings care and
                craftsmanship to patios, lawns, planting beds, and complete yard
                transformations across Central New Jersey.
              </p>
              <ul className="checklist">
                {[
                  "Locally owned in North Plainfield, NJ",
                  "Landscaping, hardscaping & outdoor living",
                  "Free, no-pressure consultations & estimates",
                  "Residential & commercial properties",
                ].map((item) => (
                  <li key={item}>
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="text-link">
                Let’s talk about your space <Arrow />
              </a>
            </div>
          </div>
        </section>

        <section className="section section--cream" id="services">
          <div className="shell">
            <div className="section-intro section-intro--center">
              <div className="eyebrow">What We Do</div>
              <h2>
                Landscaping & outdoor
                <br />
                <i>living services</i>
              </h2>
              <p>
                From the first sketch to the finishing touches.
                <br />
                Choose a service to start your free consultation.
              </p>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <a
                  href="#contact"
                  className={`service-card ${service.className || ""}`}
                  id={`service-${service.id}`}
                  key={service.id}
                  onClick={() => selectRequest({ service: service.title })}
                  aria-label={`Get a quote for ${service.title}`}
                >
                  <img src={service.image} alt="" loading="lazy" />
                  <div className="service-card__shade" />
                  <div className="service-card__content">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <span className="service-card__action">
                      Let’s plan your project <Arrow />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--dark" id="portfolio">
          <div className="shell">
            <div className="section-intro section-intro--center">
              <div className="eyebrow">Made with care</div>
              <h2>
                Our work. <i>Your inspiration.</i>
              </h2>
              <p>
                A closer look at projects from the New Sunrise crew.
                <br />
                Select any photo to explore.
              </p>
            </div>
            <div className="portfolio-grid">
              {portfolio.map((item, index) => (
                <button
                  className="portfolio-item"
                  key={item.title}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View ${item.category} project`}
                >
                  <img src={item.image} alt={item.alt} loading="lazy" />
                  <span>
                    {item.category}
                    <Arrow />
                  </span>
                </button>
              ))}
            </div>
            <div className="portfolio-cta">
              <p>Have something in mind for your home?</p>
              <a href="#contact" className="button button--cream">
                Let’s make it happen <Arrow />
              </a>
            </div>
          </div>
        </section>

        <section className="section section--areas" id="areas">
          <div className="shell areas-grid">
            <div>
              <div className="eyebrow">Close to home</div>
              <h2>
                Proudly serving North Plainfield & Central <i>New Jersey.</i>
              </h2>
              <p>
                Our roots are local. So is our commitment to making every
                neighborhood a little more beautiful.
              </p>
              <div className="town-grid">
                {towns.map((town) => (
                  <a
                    href="#contact"
                    className="town-pill"
                    key={town}
                    onClick={() => selectRequest({ town })}
                    aria-label={`Request service in ${town}`}
                  >
                    {town}
                  </a>
                ))}
              </div>
              <a href="#contact" className="text-link">
                Nearby? Ask about your area <Arrow />
              </a>
            </div>
            <div className="location-card">
              <LocationMap
                latitude={storeCoordinates.lat}
                longitude={storeCoordinates.lng}
                directionsUrl={directionsUrl}
                markerLabel="New Sunrise Landscape"
              />
              <div className="location-card__body">
                <div className="eyebrow">
                  <span className="eyebrow__dot" /> Our home base
                </div>
                <h3>New Sunrise Landscape</h3>
                <address>
                  301 Maple Ave #244
                  <br />
                  North Plainfield, NJ 07060
                </address>
                <a
                  className="button button--dark button--block"
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get directions <Arrow />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--cream" id="reviews">
          <div className="shell">
            <div className="reviews-heading">
              <div>
                <div className="eyebrow">Client love</div>
                <h2>
                  Good work.
                  <br />
                  <i>Kind words.</i>
                </h2>
              </div>
              <div className="rating-hero">
                <img
                  className="google-wordmark"
                  src="/images/google-wordmark.png"
                  alt="Google"
                  width="92"
                  height="30"
                  loading="lazy"
                />
                <div>
                  <strong>5.0</strong>
                  <span className="stars" aria-label="5 out of 5 stars">
                    ★★★★★
                  </span>
                </div>
                <p>
                  Based on 54 Google reviews
                  <br />
                  <span>As featured on our original website</span>
                </p>
              </div>
            </div>
            <div className="reviews-grid">
              {testimonials.map(({ quote, name, summary }) => (
                <figure className="review" key={name}>
                  <div className="review-source-row">
                    <div className="stars" aria-label="5 out of 5 stars">
                      ★★★★★
                    </div>
                    <img
                      src="/images/google-g.png"
                      alt="Google"
                      width="24"
                      height="24"
                      loading="lazy"
                    />
                  </div>
                  <blockquote>“{quote}”</blockquote>
                  <p>{summary}</p>
                  <figcaption>
                    <span className="review-avatar" aria-hidden="true">
                      {name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <div>
                      <strong>{name}</strong>
                      <span>Google review highlight</span>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="reviews-source">
              <p>Short excerpts and summaries from our customers’ reviews.</p>
              <a
                href={reviewsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Read the original reviews <Arrow />
              </a>
            </div>
          </div>
        </section>

        <Faq />

        <section className="closing-cta">
          <div className="shell">
            <div>
              <div className="eyebrow">Your next chapter starts outside</div>
              <h2>
                Let’s make room
                <br />
                for <i>something beautiful.</i>
              </h2>
            </div>
            <a href="#contact" className="button button--dark">
              Start your project <Arrow />
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell">
          <div className="footer-grid">
            <div>
              <Brand footer />
              <p>
                Thoughtful landscaping and outdoor living. Rooted in North
                Plainfield. Made for the way you live.
              </p>
              <SocialLinks />
            </div>
            <div>
              <h3>What we do</h3>
              <ul>
                {services.map((service) => (
                  <li key={service.id}>
                    <a
                      href="#contact"
                      onClick={() => selectRequest({ service: service.title })}
                    >
                      {service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Take a look around</h3>
              <ul>
                {[
                  ["Home", "top"],
                  ["Who We Are", "about"],
                  ...navigation,
                  ["FAQs", "faq"],
                ].map(
                  ([label, id]) => (
                    <li key={id}>
                      <a href={`#${id}`}>{label}</a>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <h3>Let’s connect</h3>
              <ul>
                <li>
                  <a href={phoneHref}>{phone}</a>
                </li>
                <li>
                  <a href="sms:+19083196763">Send us a text</a>
                </li>
                <li>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
                <li>
                  <a href={directionsUrl} target="_blank" rel="noreferrer">
                    {address}
                  </a>
                </li>
                <li>Mon–Sat · 7 AM–7 PM</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
              New Sunrise Landscape.
            </span>
            <span>A little more life outdoors.</span>
            <button
              className="text-link"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to top <Arrow up />
            </button>
          </div>
        </div>
      </footer>
      <div className="mobile-callbar">
        <a href={phoneHref} className="button button--outline">
          Call the team
        </a>
        <a href="#contact" className="button button--dark">
          Free quote <Arrow />
        </a>
      </div>
      <ChatAssistant
        onQuote={(data) => selectRequest({ ...data, source: "chatbot" })}
      />
      {activeImage !== null && (
        <Lightbox
          index={activeImage}
          setIndex={setActiveImage}
          onClose={() => setActiveImage(null)}
        />
      )}
    </>
  );
}
