import "./ServiceHero.css";
import Go from "@/assets/icons/go.svg?react";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/ui/BackButton/BackButton";
import OrderButton from "@/components/ui/OrderButton";
import ServiceInfo from "@/components/ui/ServiceInfo"; 
import { useState } from "react";
import Modal from "@/components/ui/Modal";

interface ServiceHeroProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  onButtonClick?: () => void;
  // Добавляем флаг: заставлять ли кнопку скроллить к блоку с ценой
  scrollToPrice?: boolean; 
  info: {
    title: string;
    description: string;
  }[];
}

export default function ServiceHero({
  title,
  description,
  buttonText,
  buttonLink,
  onButtonClick,
  scrollToPrice = false, // По умолчанию false
  info,
}: ServiceHeroProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleButtonClick = () => {
    // 1. Если передана внешняя функция — вызываем её
    if (onButtonClick) {
      onButtonClick();
      return;
    }

    // 2. Если передан переход на другую страницу — переходим
    if (buttonLink) {
      navigate(buttonLink);
      return;
    }

    // 3. Если передан проп скролла ИЛИ на странице есть элемент #price
    if (scrollToPrice) {
      const section = document.getElementById("price");
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 80,
          behavior: "smooth",
        });
        return;
      }
    }

    // 4. Во всех остальных случаях — открываем модалку по умолчанию!
    openModal();
  };

  return (
    <section className="service-hero">
      <BackButton />

      <div className="service-hero__content">
        <div className="service-hero__left">
          <h1>{title}</h1>
          <p>{description}</p>

          <div className="service-hero__info">
            {info.map((item) => (
              <ServiceInfo
                key={item.title}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>

          {buttonText && (
            <OrderButton className="tariffs-btn" onClick={handleButtonClick}>
              {buttonText} <Go />
            </OrderButton>
          )}
        </div>
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
    </section>
  );
}