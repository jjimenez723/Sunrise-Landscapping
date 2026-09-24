import { useEffect, useRef, useState } from "react";
import {
  emptyRequest,
  phone,
  phoneHref,
  serviceOptions,
  towns,
  validateField,
} from "../data/site";
import { Arrow, Mark } from "./Brand";

const greeting =
  "Hi! I’m the New Sunrise automated assistant. I can help plan your request, explain our services, or check our service area. What can I help with?";
const steps = [
  {
    name: "service",
    prompt: "What can we help you with? Choose a service below.",
  },
  { name: "town", prompt: "Which New Jersey town is your property in?" },
  { name: "name", prompt: "Great. What’s your name?" },
  {
    name: "phone",
    prompt: "What phone number should the crew use to reach you?",
  },
  { name: "email", prompt: "And what’s your email address?" },
  {
    name: "message",
    prompt:
      "Tell us a little about your project. You can also choose Skip for now.",
  },
];

export default function ChatAssistant({ onQuote }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: greeting },
  ]);
  const [step, setStep] = useState(-1);
  const [draft, setDraft] = useState(emptyRequest);
  const [input, setInput] = useState("");
  const log = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const launcher = useRef(null);
  const append = (text, reply) =>
    setMessages((current) => [
      ...current,
      { role: "user", text },
      { role: "assistant", text: reply },
    ]);
  const close = () => {
    setOpen(false);
    launcher.current?.focus();
  };

  useEffect(() => {
    if (open) {
      const target =
        inputRef.current || panelRef.current?.querySelector("button");
      target?.focus({ preventScroll: true });
    }
  }, [open]);
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, open]);

  const respond = (value) => {
    const text = value.trim();
    if (!text) return;
    setInput("");
    const lower = text.toLowerCase();
    if (lower === "start over") {
      setDraft(emptyRequest);
      setStep(-1);
      setMessages([{ role: "assistant", text: greeting }]);
      return;
    }
    if (step >= 0 && step < steps.length) {
      const field = steps[step].name;
      const answer =
        field === "message" && lower === "skip for now" ? "" : text;
      const error = validateField(field, answer);
      if (error) {
        append(text, error);
        return;
      }
      setDraft((current) => ({ ...current, [field]: answer }));
      const next = step + 1;
      setStep(next);
      let reply =
        steps[next]?.prompt ||
        "Your details are ready. Choose Review my request to check them in the form and complete the send step. Nothing has been sent yet.";
      if (
        field === "town" &&
        !towns.some((town) => town.toLowerCase() === lower)
      )
        reply = `We’ll need to confirm availability in ${answer}. ${reply}`;
      append(text, reply);
      return;
    }
    if (/quote|estimate|consultation|start a project/.test(lower)) {
      setStep(0);
      setDraft(emptyRequest);
      append(text, steps[0].prompt);
    } else if (/area|town|where|serve|location/.test(lower)) {
      append(
        text,
        `We serve ${towns.join(", ")}. Nearby? Include your town in a request and the team can confirm availability.`,
      );
    } else if (/hour|open|sunday|saturday|weekend/.test(lower)) {
      append(
        text,
        "Our listed hours are Monday–Saturday, 7 AM–7 PM. You can prepare a request here any time; the crew will follow up during business hours.",
      );
    } else if (/cost|price|pricing|how much|free/.test(lower)) {
      append(
        text,
        "Consultations and estimates are free. Project pricing depends on your property and the work involved, so the crew will provide a quote after learning about your space.",
      );
    } else if (
      /service|patio|paver|lawn|landscap|wall|mulch|cleanup|clean up|tree|shrub/.test(
        lower,
      )
    ) {
      append(
        text,
        "We help with lawn care, landscape design, paver patios and walkways, retaining walls, tree and shrub care, mulch, and seasonal cleanups. Choose Get a free quote to tell us about your project.",
      );
    } else if (/human|person|call|contact|luis|phone/.test(lower)) {
      append(
        text,
        `You can reach the team at ${phone}, Monday–Saturday, 7 AM–7 PM. Use the Call the team link below.`,
      );
    } else {
      append(
        text,
        "I can help with services, service areas, hours, and consultation requests. For project-specific advice or scheduling, call the crew or choose Get a free quote below.",
      );
    }
  };

  const choices =
    step === 0
      ? serviceOptions
      : step === 1
        ? ["North Plainfield", "Westfield", "Watchung"]
        : step === 5
          ? ["Skip for now"]
          : step === -1
            ? [
                "Get a free quote",
                "Services",
                "Service areas",
                "Hours",
                "Pricing",
              ]
            : [];
  const field = steps[step]?.name;
  return (
    <div
      className="chat-widget"
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          event.stopPropagation();
          close();
        }
      }}
    >
      {open && (
        <section
          className="chat-panel"
          ref={panelRef}
          id="sunrise-chat"
          role="region"
          aria-label="New Sunrise automated assistant"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              close();
            }
          }}
        >
          <header className="chat-header">
            <Mark />
            <div>
              <strong>Your project assistant</strong>
              <span>New Sunrise · Automated assistant</span>
            </div>
            <button aria-label="Close chat" onClick={close}>
              ×
            </button>
          </header>
          <div
            className="chat-log"
            ref={log}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((message, index) => (
              <div
                className={`chat-message chat-message--${message.role}`}
                key={index}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-options">
            {choices.map((choice) => (
              <button key={choice} onClick={() => respond(choice)}>
                {choice}
              </button>
            ))}
            {step === steps.length && (
              <button
                className="chat-review"
                onClick={() => {
                  onQuote(draft);
                  setOpen(false);
                }}
              >
                Review my request <Arrow />
              </button>
            )}
          </div>
          {step !== steps.length && (
            <form
              className="chat-input"
              onSubmit={(event) => {
                event.preventDefault();
                respond(input);
              }}
            >
              <label className="sr-only" htmlFor="chat-message">
                {steps[step]?.prompt || "Your message"}
              </label>
              <input
                ref={inputRef}
                id="chat-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={
                  step < 0
                    ? "Ask a question…"
                    : field === "service"
                      ? "Choose a service above…"
                      : "Type your answer…"
                }
                type={
                  field === "email"
                    ? "email"
                    : field === "phone"
                      ? "tel"
                      : "text"
                }
                maxLength={field === "message" ? 1500 : 250}
                autoComplete={
                  field === "name"
                    ? "name"
                    : field === "email"
                      ? "email"
                      : field === "phone"
                        ? "tel"
                        : "off"
                }
              />
              <button aria-label="Send message" disabled={!input.trim()}>
                <Arrow />
              </button>
            </form>
          )}
          <footer className="chat-footer">
            <a href={phoneHref}>Call the team</a>
            <button onClick={() => respond("Start over")}>Start over</button>
          </footer>
        </section>
      )}
      <button
        ref={launcher}
        className={`chat-launcher ${open ? "chat-launcher--open" : ""}`}
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls="sunrise-chat"
        aria-label={open ? "Close project chat" : "Chat about your project"}
      >
        {open ? (
          <span aria-hidden="true">×</span>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M20 11.5a8 8 0 0 1-8 8H5l-3 2v-10a9 9 0 0 1 18 0Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M7 10h8M7 14h5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <span className="chat-launcher__copy">
              <strong>How can we help?</strong>
              <span>Questions & free quotes</span>
            </span>
          </>
        )}
      </button>
    </div>
  );
}
