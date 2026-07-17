import Header from "@/components/layouts/Header/Header";
import "@/pages/client/HomePage.css";
import "@/components/sections/HeroContent";
import HeroContent from "@/components/sections/HeroContent";
import HeroSlider from "@/components/sections/HeroSlider";
import DeliveryInfoCard from "@/components/ui/DeliveryInfoCards";
import Plane from "@/assets/icons/Plane.svg?react";
import Container from "@/assets/icons/Container.svg?react";
import ServicesCard from "@/components/ui/ServicesCard";
import air from "@/assets/img/airplane.jpg";
import ship from "@/assets/img/ship.jpg";
import Track from "@/assets/img/Track.jpg";
import car from "@/assets/img/car.png";
import official from "@/assets/img/54-min.png";
import basic from "@/assets/img/53-min.png";
import calc from "@/assets/img/calculator_img.png";
import OrderButton from "@/components/ui/OrderButton";
import Go from "@/assets/icons/go.svg?react";
import PopularProducts from "@/components/sections/PopularProducts";
import FAQ from "@/components/sections/FAQ";
import InstagramSection from "@/components/sections/InstagramSection";
import Footer from "@/components/layouts/Footer/Footer";




export default function HomePage() {
  return (
    <>
      <Header />
      <div className="home-page">
        <section className="hero">
          <div className="hero-left">
      <HeroContent/>
      </div>
      <div className="hero-right">
        <HeroSlider />
        <div className="info">
        <DeliveryInfoCard
  icon={<Plane />}
  title="Авиаперевозки"
  description="Тип доставки"
  buttonText="От 1 дня"
  buttonText2="От $9/кг"
  info="Это примерные цены и сроки. Цены зависят от страны и могут меняться. Уточняйте актуальную стоимость у менеджера."
/>

<DeliveryInfoCard
  icon={<Container />}
  title="Контейнер"
  description="Тип доставки"
  buttonText="От 14 дней"
  buttonText2="От $3/кг"
  info="Это примерные цены и сроки. Цены зависят от страны и могут меняться. Уточняйте актуальную стоимость у менеджера."
/>
</div>
      </div>
      </section>

      <section className="services">
          <div className="services-left">
            <div className="services-left__sticky">
      <h1>Логистические решения</h1>
      <h2>Все виды доставки - в одном месте</h2>
      <p>Авиа, контейнеры, авто, личные вещи или В2В - поможем выбрать оптимальное решение под ваш груз и страну</p>
      </div>
      </div>
      <div className="services-right">
      
       <ServicesCard
  image={air}
  title="Авиа доставка"
  description="Оптимально для лёгких и срочных грузов"
  to="/services/air"
   buttonText="Подробнее"
/>

<ServicesCard
  image={ship}
  title="Контейнерная доставка"
  description="Выгодно для тяжёлых и объёмных партий"
  to="/services/container"
  buttonText="Подробнее"
/>
<ServicesCard
  image={Track}
  title="B2B-доставка для бизнеса"
  description="Гибкие условия, консолидация и сопровождение для юрлиц"
  to="/services/container"
  buttonText="Подробнее"
/>
<ServicesCard
  image={car}
  title="Контейнер для отправки авто"
  description="Целый контейнер для вас - надежно, выгодно и без сюрпризов"
  to="/services/container"
  buttonText="Подробнее"
/>
<ServicesCard
  image={official}
  title="Официальный импорт"
  description="Услуги оформления всех документов и таможни"
  to="/services/container"
  buttonText="Подробнее"
/>
<ServicesCard
  image={basic}
  title="Отправка обычных товаров"
  description="Удобная отправка повседневных посылок из Кореи"
  to="/services/container"
  buttonText="Подробнее"
/>

      </div>
      </section>
      <section className="calculator">
        <div className="calculator-left">
         <img
    src={calc}
    alt="Калькулятор"
    className="calculator-image"
  />
        
    </div>

    <div className="calculator-right">
       <h1>Получите точный расчет доставки за 30 минут</h1>
      <p>Оставьте заявку, наш менеджер свяжется с вами и уточнит детали</p>
      <OrderButton className="order-btn" to="/create-order">
  Оставить заявку <Go />
</OrderButton>
    </div>
      </section>
    
  <PopularProducts/>
    </div>
    <FAQ />
    <InstagramSection />

<Footer />
    </>
  );
}