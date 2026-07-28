import "@/components/sections/HeroContent.css";
import OrderButton from "@/components/ui/OrderButton";
import Go from "@/assets/icons/go.svg?react";
import "@/styles/Style.css";
import managerVideo from "@/assets/video/manager.mp4";


export default function HeroContent() {
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
    <OrderButton className="order-btn" to="/create-order">
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
    </>
    )
}