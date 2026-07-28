import "@/components/sections/FAQ.css";
import { FiPlus, FiX } from "react-icons/fi";

export interface FAQItem {
  question: string;
   answer: string | string[];
}

interface FAQProps {
  title: string;
  description: string;
  items: FAQItem[];
}

export default function FAQ({
  title,
  description,
  items,
}: FAQProps) {
  return (
    <section className="faq">
      <div className="faq-left">
        <h2>{title}</h2>

        <p>{description}</p>
      </div>

      <div className="faq-right">
        {items.map((item) => (
          <details key={item.question} className="faq-item">
            <summary>
              <span className="question">{item.question}</span>

              <span className="faq-icon">
                <FiPlus className="plus" />
                <FiX className="close" />
              </span>
            </summary>

            {Array.isArray(item.answer) ? (
  <ul className="faq-list">
    {item.answer.map((answer) => (
      <li key={answer}>{answer}</li>
    ))}
  </ul>
) : (
  <p>{item.answer}</p>
)}
          </details>
        ))}
      </div>
    </section>
  );
}