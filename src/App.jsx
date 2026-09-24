import { useEffect, useState } from "react";
import { isFirebaseConfigured } from "./lib/firebase";
import { submitQuoteRequest } from "./services/leads";

const phone = "(908) 319-6763";
const phoneHref = "tel:+19083196763";
const email = "info@newsunriselandscape.com";

const images = {
  hero: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=86",
  about: "https://images.unsplash.com/photo-1558521958-0a228e77e984?auto=format&fit=crop&w=1200&q=86",
  patio: "https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=1200&q=86",
  lawn: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=86",
  design: "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1200&q=86",
  walls: "https://images.unsplash.com/photo-1622398925373-3f91b1a5f9a0?auto=format&fit=crop&w=1200&q=86",
  planting: "https://images.unsplash.com/photo-1599685315640-7b6c2c4a4b51?auto=format&fit=crop&w=1200&q=86",
  cleanup: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=1200&q=86",
};

const services = [
  { title: "Hardscaping & Paver Patios", description: "Custom stone patios, walkways, and steps built for every New Jersey season.", image: images.patio, className: "service-card--large" },
  { title: "Lawn Care & Maintenance", description: "Mowing, edging, and season-round care for a thick, healthy lawn.", image: images.lawn, className: "service-card--wide" },
  { title: "Landscape Design", image: images.design },
  { title: "Retaining Walls", image: images.walls },
  { title: "Tree, Shrub & Mulch", description: "Shaping and fresh mulch beds that frame your property.", image: images.planting, className: "service-card--wide" },
  { title: "Spring & Fall Cleanup", description: "Leaf removal and seasonal cleanup, done right.", image: images.cleanup, className: "service-card--wide" },
];

const portfolio = [
  { title: "Paver patio retreat", image: images.patio },
  { title: "Healthy lawn renovation", image: images.lawn },
  { title: "Planting bed refresh", image: images.planting },
  { title: "Modern garden design", image: images.design },
  { title: "Stone wall detail", image: images.walls },
  { title: "Seasonal property cleanup", image: images.cleanup },
];

const towns = ["North Plainfield", "Plainfield", "South Plainfield", "Warren", "Watchung", "Short Hills", "Fanwood", "Scotch Plains", "Westfield"];

const testimonials = [
  ["I first hired Luis to replace and remove some sand from where a pool used to be. He gave me a great price when he said he would and did a great job.", "Gail N."],
  ["Job was done fast and great service overall. Highly recommend to anyone needing lawn care!", "JG Cordova"],
  ["Excellent work. Reliable and fairly priced. Thank you.", "Craig Forman"],
];

const serviceOptions = ["Lawn Care & Maintenance", "Landscape Design", "Hardscaping & Paver Patios", "Retaining Walls", "Tree, Shrub & Mulch", "Spring / Fall Cleanup", "Something else"];

function Mark() {
  return <svg className="brand-mark" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="54" r="25" fill="url(#sunGradient)" /><path d="M10 84c11-16 24-24 40-24s29 8 40 24" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /><defs><linearGradient id="sunGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd58b" /><stop offset="1" stopColor="#f47c51" /></linearGradient></defs></svg>;
}

function Arrow({ up = false }) {
  return <svg className={up ? "icon icon--up" : "icon"} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={up ? "M12 19V5m-7 7 7-7 7 7" : "M5 12h13m-5-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Check() {
  return <svg className="check-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m4 12.5 5 5L20 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function MenuIcon({ close = false }) {
  return close ? <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> : <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [formState, setFormState] = useState({ status: "idle", message: "" });
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", service: "", town: "", message: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 520);
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setActiveImage(null);
      }
      if (activeImage !== null && event.key === "ArrowRight") setActiveImage((current) => (current + 1) % portfolio.length);
      if (activeImage !== null && event.key === "ArrowLeft") setActiveImage((current) => (current - 1 + portfolio.length) % portfolio.length);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeImage]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};
    if (formData.name.trim().length < 2) nextErrors.name = "Please enter your name.";
    if (formData.phone.replace(/\D/g, "").length < 10) nextErrors.phone = "Please enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) nextErrors.email = "Please enter a valid email.";
    if (!formData.service) nextErrors.service = "Please choose a service.";
    if (formData.town.trim().length < 2) nextErrors.town = "Please enter your town.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setFormState({ status: "submitting", message: "" });
    try {
      const result = await submitQuoteRequest(formData);
      setFormState({
        status: "success",
        message: result.mode === "firebase" ? "We'll reach out shortly to schedule your free consultation." : "Saved in this browser for now. Connect Firebase to send it to your live lead inbox.",
      });
    } catch (error) {
      console.error(error);
      setFormState({ status: "error", message: "Something went wrong. Please call us and we'll take care of you." });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", phone: "", email: "", service: "", town: "", message: "" });
    setErrors({});
    setFormState({ status: "idle", message: "" });
  };

  const closeMobile = () => setMobileOpen(false);
  const navItems = ["Services", "Portfolio", "Areas We Serve", "Reviews", "Contact"];
  const sectionId = (item) => (item === "Areas We Serve" ? "areas" : item.toLowerCase());

  return (
    <>
      <div className="utility-bar"><div className="shell utility-inner"><span>Serving North Plainfield & Central New Jersey · Mon–Sat, 7:00 AM–7:00 PM</span><a href={phoneHref}>{phone}</a></div></div>

      <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
        <div className="shell nav-inner">
          <a href="#top" className="brand" onClick={closeMobile}><Mark /><span>New Sunrise <em>Landscape</em></span></a>
          <nav className="desktop-nav" aria-label="Main navigation">{navItems.map((item) => <a key={item} href={`#${sectionId(item)}`}>{item}</a>)}</nav>
          <div className="nav-actions"><a className="nav-phone" href={phoneHref}>{phone}</a><a href="#contact" className="button button--dark button--small">Free Quote <Arrow /></a><button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="Open menu"><MenuIcon /></button></div>
        </div>
      </header>

      <div className={`mobile-drawer ${mobileOpen ? "mobile-drawer--open" : ""}`} aria-hidden={!mobileOpen}>
        <div className="mobile-drawer__top"><a href="#top" className="brand" onClick={closeMobile}><Mark /><span>New Sunrise <em>Landscape</em></span></a><button className="menu-button" onClick={closeMobile} aria-label="Close menu"><MenuIcon close /></button></div>
        <nav className="mobile-nav">{navItems.map((item) => <a key={item} href={`#${sectionId(item)}`} onClick={closeMobile}>{item}<Arrow /></a>)}</nav>
        <div className="mobile-drawer__actions"><a href={phoneHref} className="button button--outline">Call {phone}</a><a href="#contact" className="button button--dark" onClick={closeMobile}>Request Free Consultation</a></div>
      </div>

      <main>
        <section className="hero" id="top">
          <div className="hero__glow" />
          <div className="shell hero__content">
            <div className="eyebrow"><span className="eyebrow__dot" /> New Sunrise Landscape · North Plainfield, NJ</div>
            <h1>Outdoor spaces,<br /><span>beautifully</span> built.</h1>
            <p className="hero__lead">Custom patios, healthy lawns, and complete outdoor living — designed and built by our own crew across Central New Jersey.</p>
            <div className="button-row"><a href="#contact" className="button button--cream">Request Free Consultation <Arrow /></a><a href={phoneHref} className="text-link text-link--light">Call {phone}<Arrow /></a></div>
          </div>
          <div className="hero__image-wrap"><img className="hero__image" src={images.hero} alt="A finished backyard patio and garden outdoor living space" /><div className="hero__image-caption"><span>Crafting the places<br />you come home to.</span><span>01 / 04</span></div></div>
        </section>

        <section className="stats"><div className="shell stats-grid">{[["5.0★", "Google Rating"], ["54+", "5-Star Reviews"], ["9", "NJ Towns Served"], ["7", "Days a Week"]].map(([number, label]) => <div className="stat" key={label}><strong>{number}</strong><span>{label}</span></div>)}</div></section>

        <section className="section section--about" id="about"><div className="shell about-grid"><div className="image-frame image-frame--about"><img src={images.about} alt="Garden bed and stone patio details" /><span className="image-note">Built with intention<br />since 2016</span></div><div className="about-copy"><div className="eyebrow">Who We Are</div><h2>Distinctive outdoor living, <i>done right.</i></h2><p>New Sunrise Landscape designs and builds outdoor spaces that enhance the beauty, comfort, and value of your home — from custom paver patios and walkways to retaining walls, planting beds, and complete yard transformations.</p><p>Every project is handled by our own experienced crew, using quality materials and close attention to detail from the first shovel to the final walk-through.</p><ul className="checklist">{["Locally owned & operated in North Plainfield, NJ", "5.0★ rating across 54+ Google reviews", "Free, no-pressure consultations & estimates", "Residential & commercial properties"].map((item) => <li key={item}><Check />{item}</li>)}</ul><a href="#contact" className="text-link">Learn More & Get a Quote <Arrow /></a></div></div></section>

        <section className="section section--cream" id="services"><div className="shell"><div className="section-intro section-intro--center"><div className="eyebrow">What We Do</div><h2>Landscaping & outdoor<br /><i>living services</i></h2><p>Transforming your outdoor space into something extraordinary — one project at a time.</p></div><div className="service-grid">{services.map((service) => <article className={`service-card ${service.className || ""}`} key={service.title}><img src={service.image} alt="" /><div className="service-card__shade" /><div className="service-card__content"><h3>{service.title}</h3>{service.description && <p>{service.description}</p>}</div></article>)}</div></div></section>

        <section className="section section--dark" id="portfolio"><div className="shell"><div className="section-intro section-intro--center"><div className="eyebrow">Our Work</div><h2>See the <i>transformation</i></h2><p>Real projects, completed for real homeowners across New Jersey.</p></div><div className="portfolio-grid">{portfolio.map((item, index) => <button className="portfolio-item" key={item.title} onClick={() => setActiveImage(index)}><img src={item.image} alt={item.title} /><span>{item.title}<Arrow /></span></button>)}</div></div></section>

        <section className="section section--areas" id="areas"><div className="shell areas-grid"><div><div className="eyebrow">Where We Work</div><h2>Proudly serving North Plainfield & Central <i>New Jersey</i></h2><p>Whether you're refreshing a garden bed or planning a full outdoor transformation, our crew provides reliable, high-quality service throughout:</p><div className="town-grid">{towns.map((town) => <span className="town-pill" key={town}>{town}</span>)}</div><a href="#contact" className="button button--dark">Check if We Serve Your Area <Arrow /></a></div><div className="location-card"><div className="location-card__pin">✦</div><div className="eyebrow">Our home base</div><h3>New Sunrise Landscape</h3><address>301 Maple Ave #244<br />North Plainfield, NJ 07060</address><a className="button button--outline button--block" href="https://www.google.com/maps/search/?api=1&query=301+Maple+Ave+%23244+North+Plainfield+NJ+07060" target="_blank" rel="noreferrer">Get Directions <Arrow /></a></div></div></section>

        <section className="section section--cream" id="reviews"><div className="shell"><div className="rating-hero"><div className="eyebrow">Client Love</div><strong>5.0</strong><div className="stars">★★★★★</div><p>Based on 54 Google reviews</p></div><div className="reviews-grid">{testimonials.map(([quote, name]) => <figure className="review" key={name}><blockquote>“{quote}”</blockquote><figcaption><strong>{name}</strong><span>Google review</span></figcaption></figure>)}</div></div></section>

        <section className="section section--dark contact-section" id="contact"><div className="shell"><div className="contact-heading"><div className="eyebrow">Get Started Today</div><h2>Let's build something <i>beautiful.</i></h2><p>Tell us about your project and we'll follow up with a free, no-obligation consultation — usually within one business day.</p></div><div className="form-card">{formState.status === "success" ? <div className="success-state"><div className="success-state__icon">✓</div><h3>Thanks — request received!</h3><p>{formState.message}</p><button className="button button--outline" onClick={resetForm}>Submit Another Request</button></div> : <><div className="form-card__intro"><h3>Request a Free Consultation</h3><p>No pressure, no obligation — just an honest quote.</p></div><form onSubmit={handleSubmit} noValidate><div className="form-row"><Field label="Full Name" name="name" value={formData.name} placeholder="Jane Smith" error={errors.name} onChange={updateField} /><Field label="Phone Number" name="phone" type="tel" value={formData.phone} placeholder={phone} error={errors.phone} onChange={updateField} /></div><Field label="Email Address" name="email" type="email" value={formData.email} placeholder="you@email.com" error={errors.email} onChange={updateField} /><div className="form-row"><Field as="select" label="Service Needed" name="service" value={formData.service} error={errors.service} onChange={updateField} options={serviceOptions} /><Field label="Town" name="town" value={formData.town} placeholder="e.g. Westfield" error={errors.town} onChange={updateField} /></div><Field as="textarea" label={<>Project Details <span>(optional)</span></>} name="message" value={formData.message} placeholder="Tell us a bit about what you're looking for..." onChange={updateField} /><button className="button button--dark button--block" disabled={formState.status === "submitting"}>{formState.status === "submitting" ? "Sending request…" : "Request Free Consultation"}<Arrow /></button>{formState.status === "error" && <div className="form-alert">{formState.message}</div>}{!isFirebaseConfigured && <div className="form-hint">Firebase is not connected yet, so submissions are queued in this browser while you develop.</div>}</form></>}</div><div className="contact-line"><a href={phoneHref}>{phone}</a><span>·</span><a href={`mailto:${email}`}>{email}</a><span>·</span><span>301 Maple Ave #244, North Plainfield, NJ</span></div></div></section>
      </main>

      <footer className="site-footer"><div className="shell"><div className="footer-grid"><div><a href="#top" className="brand brand--footer"><Mark /><span>New Sunrise <em>Landscape</em></span></a><p>Professional landscaping, lawn care, hardscaping, and outdoor living solutions throughout Central New Jersey.</p></div><FooterColumn title="Services" links={["Lawn Care", "Landscape Design", "Hardscaping", "Retaining Walls", "Trimming & Mulch", "Spring & Fall Cleanup"]} /><FooterColumn title="Company" links={["Home", "About", "Portfolio", "Areas We Serve", "Reviews", "Contact"]} /><div><h4>Get in Touch</h4><ul><li>Call: <a href={phoneHref}>{phone}</a></li><li>Text: <a href="sms:+19083196763">{phone}</a></li><li>Email: <a href={`mailto:${email}`}>{email}</a></li><li><a href="https://www.google.com/maps/search/?api=1&query=301+Maple+Ave+%23244+North+Plainfield+NJ+07060" target="_blank" rel="noreferrer">301 Maple Ave #244, North Plainfield, NJ</a></li></ul></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} New Sunrise Landscape. All rights reserved.</span><span>Mon–Sat 7:00 AM–7:00 PM · North Plainfield, NJ</span></div></div></footer>

      <div className="mobile-callbar"><a href={phoneHref} className="button button--outline">Call</a><a href="#contact" className="button button--dark">Free Quote</a></div>
      {scrolled && <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top"><Arrow up /></button>}
      {activeImage !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label={portfolio[activeImage].title} onClick={(event) => event.target === event.currentTarget && setActiveImage(null)}><button className="lightbox__close" onClick={() => setActiveImage(null)} aria-label="Close gallery">×</button><button className="lightbox__prev" onClick={() => setActiveImage((activeImage - 1 + portfolio.length) % portfolio.length)} aria-label="Previous image">‹</button><img src={portfolio[activeImage].image} alt={portfolio[activeImage].title} /><button className="lightbox__next" onClick={() => setActiveImage((activeImage + 1) % portfolio.length)} aria-label="Next image">›</button><div className="lightbox__caption">{portfolio[activeImage].title}</div></div>}
    </>
  );
}

function Field({ as = "input", label, name, value, onChange, error, options, ...props }) {
  return <label className={`field ${error ? "field--error" : ""}`}><span>{label}</span>{as === "select" ? <select name={name} value={value} onChange={onChange}><option value="">Select a service</option>{options.map((option) => <option value={option} key={option}>{option}</option>)}</select> : as === "textarea" ? <textarea name={name} value={value} onChange={onChange} {...props} /> : <input name={name} value={value} onChange={onChange} {...props} />}{error && <small>{error}</small>}</label>;
}

function FooterColumn({ title, links }) {
  return <div><h4>{title}</h4><ul>{links.map((link) => {
    const target = title === "Services" ? "services" : link === "Home" ? "top" : link === "Areas We Serve" ? "areas" : link.toLowerCase();
    return <li key={link}><a href={`#${target}`}>{link}</a></li>;
  })}</ul></div>;
}

export default App;
