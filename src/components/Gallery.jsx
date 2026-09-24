import { useEffect, useRef, useState } from "react";
import { portfolio } from "../data/site";
import { Arrow } from "./Brand";

export function ProjectGallery({ onOpen }) {
  const track = useRef(null);
  const [active, setActive] = useState(0);
  const slides = portfolio.slice(0, 4);
  const goTo = (index) => {
    const next = (index + slides.length) % slides.length;
    track.current.scrollTo({
      left: next * track.current.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  return (
    <section className="project-showcase" aria-label="Featured projects">
      <div className="shell">
        <div className="showcase-heading">
          <div>
            <div className="eyebrow">A little of what we do</div>
            <h2>
              Outside, <i>reimagined.</i>
            </h2>
          </div>
          <p>
            Real spaces. Our own crew.
            <br />
            Explore a few of our favorite details.
          </p>
        </div>
        <div
          className="project-track"
          ref={track}
          onScroll={() =>
            setActive(
              Math.round(track.current.scrollLeft / track.current.clientWidth),
            )
          }
        >
          {slides.map((item, index) => (
            <button
              className="project-slide"
              key={item.title}
              onClick={() => onOpen(index)}
              aria-label={`Enlarge ${item.title}`}
              tabIndex={active === index ? 0 : -1}
            >
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                width="1200"
                height="750"
              />
              <span className="project-slide__caption">
                <span>
                  <small>{item.category}</small>
                  <strong>{item.title}</strong>
                </span>
                <span className="round-button" aria-hidden="true">
                  <Arrow />
                </span>
              </span>
            </button>
          ))}
        </div>
        <div className="gallery-controls">
          <span className="gallery-count" aria-live="polite">
            0{active + 1} <span>/ 04</span>
          </span>
          <div className="gallery-dots">
            {slides.map((item, index) => (
              <button
                key={item.title}
                aria-label={`Show photo ${index + 1}: ${item.category}`}
                aria-pressed={active === index}
                onClick={() => goTo(index)}
              >
                <span />
              </button>
            ))}
          </div>
          <div className="gallery-arrows">
            <button
              className="round-button"
              aria-label="Previous featured photo"
              onClick={() => goTo(active - 1)}
            >
              ←
            </button>
            <button
              className="round-button"
              aria-label="Next featured photo"
              onClick={() => goTo(active + 1)}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Lightbox({ index, setIndex, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);
  const previous = () =>
    setIndex((index - 1 + portfolio.length) % portfolio.length);
  const next = () => setIndex((index + 1) % portfolio.length);
  const photo = portfolio[index];
  return (
    <dialog
      className="lightbox"
      ref={dialog}
      aria-label="Project photo viewer"
      onCancel={onClose}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          previous();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          next();
        }
      }}
    >
      <button
        className="lightbox__close"
        onClick={onClose}
        aria-label="Close gallery"
        autoFocus
      >
        ×
      </button>
      <button
        className="lightbox__prev"
        onClick={previous}
        aria-label="Previous image"
      >
        ‹
      </button>
      <img src={photo.image} alt={photo.alt} />
      <button className="lightbox__next" onClick={next} aria-label="Next image">
        ›
      </button>
      <div className="lightbox__caption" aria-live="polite">
        {photo.title}
        <span>
          {index + 1} / {portfolio.length}
        </span>
      </div>
    </dialog>
  );
}
