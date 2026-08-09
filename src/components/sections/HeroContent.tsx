import "@/components/sections/HeroContent.css";
import OrderButton from "@/components/ui/OrderButton";
import Go from "@/assets/icons/go.svg?react";
import "@/styles/Style.css";
import managerVideo from "@/assets/video/manager.mp4";
import { useState } from 'react';
import Modal from "@/components/ui/Modal";


export default function HeroContent() {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
const scrollToServices = () => {
  const section = document.getElementById("services-cards");

  if (section) {
    window.scrollTo({
      top: section.offsetTop - 80, // если Header фиксированный
      behavior: "smooth",
    });
  }
};
    return (
        <>
    <div className="tab">
        <button className="InfBtn">Карго</button>
        <button className="InfBtn">Логистика</button>
        <button className="InfBtn">Доставка товаров</button>
    </div>   
    <h1>K-Trust — логистическая компания в Южной Корее</h1> 
    <a className="text1">Мы делаем логистику простой и удобной.</a>
    <div className="buttons">
   <OrderButton className="order-btn" onClick={openModal}>
  Оставить заявку <Go />
</OrderButton>
<OrderButton className="menu-btn"  onClick={scrollToServices}>
Услуги</OrderButton>
</div>
<div className="review-card">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="manager-video"
      >
        <source src={managerVideo} type="video/mp4" />
      </video>

      <p>
        Выберите удобный вариант доставки — остальное мы возьмём на себя. Подберём лучшие условия по срокам и цене.
      </p>
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
    </>
    )
}