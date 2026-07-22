import Header from "@/components/layouts/Header/Header";
import "@/pages/client/HomePage.css";
import "@/pages/client/Services/AirDeliveryPage.css";
import "@/components/sections/HeroContent";
import shutterstock_2362125 from "@/assets/img/shutterstock_2362125.jpg"
import Calculator from "@/components/sections/Calculator";
import Footer from "@/components/layouts/Footer/Footer";
import ServiceHero from "@/components/sections/Services/ServiceHero";
import { deliveryTables } from "@/data/deliveryTables";
import Table from "@/components/ui/Table";


export default function AirDeliveryPage() {

   return (
    <>
      <Header />
      <div className="service-page">
        <section className="service-page-hero">
          <div className="hero-left">
      <ServiceHero
    title="Авиа перевозки из Южной Кореи"
    description=""
    buttonText="Тарифы"
    info={[
    {
      title: "Скорость доставки",
      description: "От 1 до 21 дня в зависимости от страны",
    },
    {
      title: "Стоимость",
      description: "Дороже, чем контейнером",
    },
    {
      title: "Товар",
      description: "Идеально для небольших партий",
    },
  ]}
/>

      </div>
      <div className="service-hero__right">
    
          <img src={shutterstock_2362125}/>

      </div>
      </section>

    <section id="price" className="price-section">
        <h1>Тарифы авиа</h1> 
  <div className="tab">
  {deliveryTables.air.tariffs.map((country) => (
    <a
      key={country.id}
      href={`#${country.id}`}
      className="InfBtn"
    >
      {country.country}
    </a>
  ))}
</div>
  {deliveryTables.air.tariffs.map((country) => (
  <Table
    key={country.id}
    id={country.id}
    title={country.country}
    rows={country.rows}
     notes={country.notes}
  />
))}
    
    
</section>
      <Calculator
  title="Получите консультацию"
  description="Оставьте заявку, наш менеджер свяжется с вами и уточнит детали"
  buttonText="Оставить заявку"
  className="order-btn"
 onButtonClick={() => "/create-order"}
/>
     </div>
    <Footer />
    </>
  );
}