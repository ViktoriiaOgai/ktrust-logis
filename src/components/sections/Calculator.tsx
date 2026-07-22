import "@/components/sections/Calculator.css";
import "@/styles/Style.css";
import calc from "@/assets/img/calculator_img.png";
import Go from "@/assets/icons/go.svg?react";
import { Link } from "react-router-dom";

interface CalculatorProps {
  title: string;
  description: string;
  buttonText?: string;
  className?: string;
  onButtonClick?: () => void;
    buttonLink?: string;
}

export default function Calculator({
  title,
  description,
  buttonText,
  className = "",
  buttonLink = "",
  onButtonClick,

}: CalculatorProps) {
      return (
    <div className="calculator">
      <div className="calculator-left">
        <img
          src={calc}
          alt="Калькулятор"
          className="calculator-image"
        />
      </div>

      <div className="calculator-right">
        <h1>{title}</h1>

        <p>{description}</p>

        {buttonText &&
  (buttonLink ? (
    <Link to={buttonLink} className={className}>
      {buttonText} <Go />
    </Link>
  ) : (
    <button
      type="button"
      className={className}
      onClick={onButtonClick}
    >
      {buttonText} <Go />
    </button>
  ))}
      </div>
    </div>
  );
}