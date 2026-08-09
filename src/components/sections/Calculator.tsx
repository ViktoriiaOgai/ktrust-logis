import "@/components/sections/Calculator.css";
import "@/styles/Style.css";
import calc from "@/assets/img/calculator_img.png";
import Go from "@/assets/icons/go.svg?react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Modal from "@/components/ui/Modal";

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
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Обработчик клика
  const handleButtonClick = (e: React.MouseEvent) => {
    // 1. Если передан внешний onButtonClick — вызываем его
    if (onButtonClick) {
      onButtonClick();
      return;
    }

    // 2. Если buttonLink НЕ передан (или передан обычный тэг/пустой) — открываем модалку
    if (!buttonLink) {
      e.preventDefault();
      openModal();
    }
  };

  return (
    <div className="calculator">
      <div className="calculator-left">
        <img src={calc} alt="Калькулятор" className="calculator-image" />
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
              onClick={handleButtonClick}
            >
              {buttonText} <Go />
            </button>
          ))}
      </div>

     
      {isOpen && (
  <div className="modal-overlay" onClick={closeModal}>
    <div
      className="modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Получите консультацию"
        message="Оставьте номер телефона, менеджер свяжется с Вами"
      />
    </div>
  </div>
)}
    </div>
  );
}