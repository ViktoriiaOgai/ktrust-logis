import "./Benefits.css";

export interface BenefitItem {
  number: string;
  title: string;
  description: string;
}

interface BenefitsProps {
  title: string;
  items: BenefitItem[];
}

export default function Benefits({
  title,
  items,
}: BenefitsProps) {
  return (
    <section className="benefits">
      <h2>{title}</h2>

      <div className="benefits__grid">
        {items.map((item) => (
          <article key={item.number} className="benefit-card">
            <div className="benefit-card__number">
              {item.number}
            </div>

            <h3>{item.title}</h3>

            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}