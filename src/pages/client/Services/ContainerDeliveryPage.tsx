import Header from "@/components/layouts/Header/Header";
import "@/pages/client/HomePage.css";
import "@/pages/client/Services/AirDeliveryPage.css";
import "@/components/sections/HeroContent";
import a_container_from_ins from "@/assets/img/a_container_from_ins.jpg"
import Calculator from "@/components/sections/Calculator";
import Footer from "@/components/layouts/Footer/Footer";
import ServiceHero from "@/components/sections/Services/ServiceHero";
import {containerDelivery } from "@/data/delivery/containerDelivery";
import Table from "@/components/ui/Table";
import ContainerInstructions from "@/components/sections/ContainerInstructions/ContainerInstructions";


export default function ContainerDeliveryPage() {

   return (
    <>
      <Header />
      <div className="service-page">
        <section className="service-page-hero">
          <div className="hero-left">
      <ServiceHero
    title="Контейнерная доставка из Южной Кореи"
    description=""
    buttonText="Тарифы"
    info={[
    {
      title: "Скорость доставки",
      description: "От 14 до 40 дней в зависимости от страны",
    },
    {
      title: "Стоимость",
      description: "Дешевле, чем авиа",
    },
    {
      title: "Товар",
      description: "Подходитбольших партий",
    },
  ]}
/>

      </div>
      <div className="service-hero__right">
    
          <img src={a_container_from_ins}/>

      </div>
      </section>

    <section id="price" className="price-section">
        <h1>Тарифы контейнер</h1> 
  <div className="tab">
  {containerDelivery.container.tariffs.map((country) => (
    <a
      key={country.id}
      href={`#${country.id}`}
      className="InfBtn"
    >
      {country.country}
    </a>
  ))}
</div>
  {containerDelivery.container.tariffs.map((country) => (
  <Table
    key={country.id}
    id={country.id}
    title={country.country}
    rows={country.rows}
     notes={country.notes}
  />
))}
    
    
</section>
<ContainerInstructions/>

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