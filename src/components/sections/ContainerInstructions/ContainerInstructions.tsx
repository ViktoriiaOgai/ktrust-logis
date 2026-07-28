import "./ContainerInstructions.css";
import Info from "@/assets/icons/info.svg?react";

interface InstructionsProps {
  data: {
    title: string;
    steps: {
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
      title: string;
      description: string;
    }[];
    notes?: string[];
  };
  notesTitle?: string;
  layout?: "grid" | "column";
}

export default function ContainerInstructions({
  data,
  notesTitle,
  layout = "grid",
}: InstructionsProps) {
  const { title, steps, notes } = data;

  return (
    <section className="container-instructions">
      <h2>{title}</h2>

      <div
        className={`container-instructions__steps ${
          layout === "column"
            ? "container-instructions__steps--column"
            : ""
        }`}
      >
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <div
  key={step.title}
  className={`instruction-step ${
    layout === "column"
      ? "instruction-step--column"
      : ""
  }`}>
              <div
  className={`instruction-step__icon ${
    layout === "column"
      ? "instruction-step__icon--column"
      : ""
  }`}
>
  <Icon
  className={`instruction-icon ${
    layout === "column"
      ? "instruction-icon--column"
      : ""
  }`}
/>
</div>

              <div className="instruction-step__content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {notes && notes.length > 0 && (
        <div className="container-instructions__notes">
          <div className="head">
            <Info className="table-note__icon" />

            <h3>{notesTitle}</h3>
          </div>

          <ul className="table-note__list">
  {notes.map((note) => (
    <li key={note}>{note}</li>
  ))}
</ul>
        </div>
      )}
    </section>
  );
}