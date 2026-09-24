import { faqs } from "../data/site";
import { Arrow } from "./Brand";

export default function Faq() {
  return (
    <section className="section section--faq" id="faq" aria-labelledby="faq-title">
      <div className="shell faq-grid">
        <div className="faq-intro">
          <div className="eyebrow">A little clarity</div>
          <h2 id="faq-title">
            Good questions.
            <br />
            <i>Helpful answers.</i>
          </h2>
          <p>A few things to know before we bring your outdoor plans to life.</p>
          <a href="#contact" className="text-link">
            Tell us about your project <Arrow />
          </a>
        </div>
        <div className="faq-list">
          {faqs.map(({ id, question, answer }) => (
            <details className="faq-item" key={id} id={`faq-${id}`}>
              <summary>
                {question}
                <span className="faq-toggle" aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
