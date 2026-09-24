import { useEffect, useRef, useState } from "react";
import { isFirebaseConfigured } from "../lib/firebase";
import { submitQuoteRequest } from "../services/leads";
import {
  emptyRequest,
  phone,
  phoneHref,
  email,
  services,
  towns,
  validateField,
  requestLinks,
} from "../data/site";
import { Arrow, Check } from "./Brand";

const steps = [
  {
    field: "service",
    label: "Project",
    title: "What can we help you create?",
    description: "Choose the service that best fits your outdoor plans.",
  },
  {
    field: "town",
    label: "Location",
    title: "Where’s your outdoor space?",
    description:
      "Tell us your town so we can plan a visit in your neighborhood.",
    inputLabel: "Town",
    placeholder: "e.g. North Plainfield",
    autoComplete: "address-level2",
  },
  {
    field: "name",
    label: "Your name",
    title: "What should we call you?",
    description: "Let’s put a name to your next great outdoor project.",
    inputLabel: "Full name",
    placeholder: "Jane Smith",
    autoComplete: "name",
  },
  {
    field: "phone",
    label: "Phone",
    title: "What’s the best number to reach you?",
    description: "The team can call or text to discuss your project.",
    inputLabel: "Phone number",
    placeholder: "(908) 555-0123",
    type: "tel",
    autoComplete: "tel",
  },
  {
    field: "email",
    label: "Email",
    title: "And your email address?",
    description: "One more way to keep in touch about your consultation.",
    inputLabel: "Email address",
    placeholder: "you@email.com",
    type: "email",
    autoComplete: "email",
  },
  {
    field: "message",
    label: "Review",
    title: "Your next chapter is taking shape.",
    description: "Check your details and add anything you’d like us to know.",
  },
];
const choiceLabels = [
  "Patios & walkways",
  "Lawn care",
  "Landscape design",
  "Retaining walls",
  "Planting & mulch",
  "Seasonal cleanup",
];
const firstMissingStep = (data) => {
  const index = steps
    .slice(0, 5)
    .findIndex(({ field }) => validateField(field, data[field]));
  return index < 0 ? 5 : index;
};

export default function ContactForm({ prefill }) {
  const [data, setData] = useState(emptyRequest);
  const [source, setSource] = useState("website");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [step, setStep] = useState(0);
  const formRef = useRef(null);
  const resultRef = useRef(null);
  const dataRef = useRef(data);
  const shouldFocus = useRef(false);
  dataRef.current = data;

  useEffect(() => {
    if (!prefill) return;
    const { sequence, source: nextSource, ...fields } = prefill;
    const nextData = { ...dataRef.current, ...fields };
    setData(nextData);
    setSource(nextSource || "website");
    setStatus("idle");
    setErrors({});
    setStep(firstMissingStep(nextData));
    shouldFocus.current = true;
    document
      .getElementById("contact")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }, [prefill]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (status === "success" || status === "prepared")
        resultRef.current?.focus({ preventScroll: true });
      else if (shouldFocus.current) {
        const target =
          step > 0 && step < 5
            ? formRef.current?.querySelector("input")
            : formRef.current?.querySelector("h3");
        target?.focus({ preventScroll: true });
        shouldFocus.current = false;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [step, status, prefill]);

  const moveTo = (next) => {
    shouldFocus.current = true;
    setStep(next);
    setStatus("idle");
  };
  const setField = (name, value) => {
    setData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };
  const change = (event) => setField(event.target.name, event.target.value);
  const submit = async (event) => {
    event.preventDefault();
    if (status === "submitting") return;
    if (step < 5) {
      const field = steps[step].field;
      const error = validateField(field, data[field]);
      if (error) {
        setErrors((current) => ({ ...current, [field]: error }));
        formRef.current?.querySelector("input")?.focus();
        return;
      }
      moveTo(step + 1);
      return;
    }
    const nextErrors = Object.fromEntries(
      Object.entries(data)
        .map(([key, value]) => [key, validateField(key, value)])
        .filter(([, error]) => error),
    );
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      moveTo(firstMissingStep(data));
      return;
    }
    setStatus("submitting");
    try {
      const cleaned = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value.trim()]),
      );
      const result = await submitQuoteRequest(cleaned, source);
      setData(cleaned);
      setStatus(result.mode === "firebase" ? "success" : "prepared");
    } catch {
      setStatus("error");
    }
  };
  const links = requestLinks(data);
  const finished = status === "success" || status === "prepared";
  const current = steps[step];
  const availableStep = firstMissingStep(data);

  return (
    <section className="section section--dark contact-section" id="contact">
      <div className="shell consultation-shell">
        <div className="consultation-intro">
          <div className="eyebrow">Your free consultation</div>
          <h2>
            Let’s start your <i>project.</i>
          </h2>
          <p>
            A few simple questions. A little closer to the outdoors you have in
            mind.
          </p>
        </div>
        {finished ? (
          <div className="wizard-result" ref={resultRef} tabIndex={-1}>
            <div className="success-state__icon">
              <Check />
            </div>
            <div className="eyebrow">
              {status === "success" ? "Thank you" : "Your request is ready"}
            </div>
            <h3>
              {status === "success"
                ? "We look forward to meeting you."
                : "One last step: send it our way."}
            </h3>
            <p>
              {status === "success"
                ? "Your request has been submitted. Our team will follow up to discuss your project."
                : "Open your email or text app with your details filled in, then press Send to deliver your request to the team."}
            </p>
            <RequestSummary data={data} />
            {data.message && (
              <p className="wizard-project-note">{data.message}</p>
            )}
            {status === "prepared" && (
              <>
                <div className="wizard-send-options">
                  <a className="button button--cream" href={links.email}>
                    Email my request <Arrow />
                  </a>
                  <a className="button wizard-outline" href={links.sms}>
                    Text my request <Arrow />
                  </a>
                </div>
                <p className="wizard-note">
                  Nothing has been sent yet. Prefer to call?{" "}
                  <a href={phoneHref}>{phone}</a>.
                </p>
              </>
            )}
            <button
              className="text-link"
              onClick={() => {
                if (status === "success") {
                  setData(emptyRequest);
                  setSource("website");
                  moveTo(0);
                } else moveTo(5);
              }}
            >
              {status === "success"
                ? "Start another request"
                : "Edit my details"}
            </button>
          </div>
        ) : (
          <>
            <nav className="wizard-progress" aria-label="Consultation steps">
              <ol>
                {steps.map((item, index) => (
                  <li
                    className={
                      step === index
                        ? "is-current"
                        : index < availableStep
                          ? "is-complete"
                          : ""
                    }
                    key={item.field}
                  >
                    <button
                      type="button"
                      onClick={() => moveTo(index)}
                      disabled={
                        index > availableStep || status === "submitting"
                      }
                      aria-current={step === index ? "step" : undefined}
                      aria-label={`Step ${index + 1}: ${item.label}`}
                    >
                      <span className="wizard-progress__number">
                        {index < availableStep && index !== step ? (
                          <Check />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="wizard-progress__label">
                        {item.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
            <form
              ref={formRef}
              onSubmit={submit}
              noValidate
              aria-label="Free consultation request"
              className="quote-wizard"
            >
              <fieldset disabled={status === "submitting"}>
                <div className="wizard-question" key={step}>
                  <div className="wizard-step-label" aria-live="polite">
                    Step {step + 1} of {steps.length} · {current.label}
                  </div>
                  <h3 tabIndex={-1} id="quote-question">
                    {current.title}
                  </h3>
                  <p className="wizard-description">{current.description}</p>
                  {step === 0 ? (
                    <fieldset
                      className="wizard-services"
                      aria-describedby={
                        errors.service ? "error-service" : undefined
                      }
                    >
                      <legend className="sr-only">Service needed</legend>
                      <div className="wizard-service-grid">
                        {services.map((service, index) => (
                          <label className="wizard-service" key={service.id}>
                            <input
                              className="sr-only"
                              type="radio"
                              name="service"
                              value={service.title}
                              checked={data.service === service.title}
                              onChange={change}
                              required
                              aria-invalid={!!errors.service}
                            />
                            <ServiceIcon index={index} />
                            <span>{choiceLabels[index]}</span>
                            <span
                              className="wizard-choice-check"
                              aria-hidden="true"
                            >
                              <Check />
                            </span>
                          </label>
                        ))}
                      </div>
                      <label className="wizard-other">
                        <input
                          type="radio"
                          name="service"
                          value="Something else"
                          checked={data.service === "Something else"}
                          onChange={change}
                        />
                        Something else / help me choose
                      </label>
                      {errors.service && (
                        <p
                          className="wizard-error"
                          id="error-service"
                          role="alert"
                        >
                          {errors.service}
                        </p>
                      )}
                    </fieldset>
                  ) : step < 5 ? (
                    <div className="wizard-answer">
                      <Field
                        label={current.inputLabel}
                        name={current.field}
                        type={current.type || "text"}
                        value={data[current.field]}
                        error={errors[current.field]}
                        onChange={change}
                        autoComplete={current.autoComplete}
                        placeholder={current.placeholder}
                      />
                      {step === 1 && (
                        <div className="wizard-town-choices">
                          {towns.slice(0, 5).map((town) => (
                            <button
                              type="button"
                              key={town}
                              onClick={() => setField("town", town)}
                              aria-pressed={data.town === town}
                            >
                              {town}
                            </button>
                          ))}
                          <span>
                            Nearby? Enter your town and we’ll confirm
                            availability.
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="wizard-review">
                      <RequestSummary data={data} onEdit={moveTo} />
                      <Field
                        as="textarea"
                        label="Anything else we should know? (optional)"
                        name="message"
                        value={data.message}
                        onChange={change}
                        placeholder="Tell us about your vision, timing, or any details you’d like to share…"
                      />
                    </div>
                  )}
                </div>
                <div className="wizard-actions">
                  <button
                    type="button"
                    className="wizard-back"
                    onClick={() => moveTo(step - 1)}
                    disabled={step === 0}
                  >
                    <span aria-hidden="true">←</span> Back
                  </button>
                  <span className="wizard-reassurance">
                    Free consultation. No obligation.
                  </span>
                  <button type="submit" className="button button--cream">
                    {status === "submitting"
                      ? "Preparing request…"
                      : step < 5
                        ? "Continue"
                        : isFirebaseConfigured
                          ? "Request free consultation"
                          : "Continue to send request"}
                    <Arrow />
                  </button>
                </div>
              </fieldset>
              {status === "error" && (
                <div className="wizard-error" role="alert">
                  We couldn’t submit your request. Your details are still here.
                  Try again, <a href={links.email}>send by email</a>, or{" "}
                  <a href={phoneHref}>call us</a>.
                </div>
              )}
              {step === 5 && (
                <p className="wizard-note">
                  {isFirebaseConfigured
                    ? "We’ll use your details to follow up about your project."
                    : "Next, send your request by email or text. You’re in control of the final send."}
                </p>
              )}
            </form>
          </>
        )}
        <div className="consultation-contact">
          <div>
            <span>Prefer a conversation?</span>
            <a href={phoneHref}>
              {phone} <Arrow />
            </a>
          </div>
          <div>
            <span>Here when you need us</span>
            <p>Mon–Sat · 7 AM–7 PM</p>
          </div>
          <div>
            <span>Rooted in North Plainfield</span>
            <p>Serving Central New Jersey</p>
          </div>
          <a className="text-link" href={`mailto:${email}`}>
            Send us an email <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

function Field({ as = "input", label, name, error, ...props }) {
  const attributes = {
    id: `quote-${name}`,
    name,
    required: name !== "message",
    "aria-invalid": !!error,
    "aria-describedby": error ? `error-${name}` : undefined,
    ...props,
  };
  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      <label htmlFor={`quote-${name}`}>{label}</label>
      {as === "textarea" ? (
        <textarea {...attributes} maxLength={1500} />
      ) : (
        <input {...attributes} maxLength={250} />
      )}
      {error && (
        <small id={`error-${name}`} role="alert">
          {error}
        </small>
      )}
    </div>
  );
}

function RequestSummary({ data, onEdit }) {
  return (
    <dl className="wizard-summary">
      {[
        ["Project", data.service, 0],
        ["Location", data.town, 1],
        ["Contact", `${data.name}\n${data.phone}\n${data.email}`, 2],
      ].map(([label, value, step]) => (
        <div key={label}>
          <dt>
            {label}
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(step)}
                aria-label={`Edit ${label.toLowerCase()}`}
              >
                Edit
              </button>
            )}
          </dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ServiceIcon({ index }) {
  const paths = [
    "M4 7h24v19H4zM4 16h24M16 7v9M11 16v10M23 16v10",
    "M6 27h20M10 26C7 19 7 15 6 12c7 2 10 8 10 14M16 26c0-13 3-20 10-23-1 9-4 16-10 23M16 26c2-7 6-11 12-12",
    "M16 28V14M16 20C5 21 4 14 4 8c9 0 13 4 12 12ZM16 14C15 6 21 3 28 4c0 7-4 12-12 10Z",
    "M3 7h26v20H3zM3 14h26M3 21h26M12 7v7M22 7v7M8 14v7M19 14v7M12 21v6M22 21v6",
    "M16 28v-9M10 28h12M16 3l-8 10h4l-7 9h22l-7-9h4L16 3Z",
    "M7 28 21 9M16 5l12 9M14 9l10 8M15 4l-4 6M19 7l-4 6M23 10l-4 6M27 13l-4 6",
  ];
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d={paths[index]}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
