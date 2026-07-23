import "./ContainerInstructions.css";
import Info from "@/assets/icons/info.svg?react";
import { containerInstructions } from "@/data/delivery/instructions";

export default function ContainerInstructions() {
  const { title, steps, notes } = containerInstructions;

  return (
    <section className="container-instructions">
      <h2>{title}</h2>

      <div className="container-instructions__steps">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <div key={step.title} className="instruction-step">
              <div className="instruction-step__icon">
                <Icon className="instruction-icon" />
              </div>

              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          );
        })}
      </div>

      <div className="container-instructions__notes">
        <div className="head">
         <Info className="table-note__icon" />
         <h1>Условия упаковки и ответственности</h1>
         </div>
          <ul className="table-note__list">
        {notes.map((note) => (
            
          <p key={note}>{note}</p>
        ))}
        </ul>
      </div>
    </section>
  );
}