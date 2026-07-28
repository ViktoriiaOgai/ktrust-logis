import Header from "@/components/layouts/Header/Header";
import "@/pages/client/HomePage.css";
import "@/pages/client/Services/AirDeliveryPage.css";
import "@/components/sections/HeroContent";
import carMore from "@/assets/img/carMore.png"
import Calculator from "@/components/sections/Calculator";
import Footer from "@/components/layouts/Footer/Footer";
import ServiceHero from "@/components/sections/Services/ServiceHero";
import { Partnership } from "@/data/delivery/instructions";
import ContainerInstructions from "@/components/sections/ContainerInstructions/ContainerInstructions";
import ServiceVideo from "@/components/sections/ServiceVideo";
import Benefits from "@/components/sections/Benefits";
import { officialBenefits } from "@/data/delivery/officialBenefits";



export default function CarDeliveryPage() {

   return (
    <>
      <Header />
      <div className="service-page">
        <section className="service-page-hero">
          <div className="hero-left">
      <ServiceHero
    title="Контейнер для экспорта авто"
    description="Если ваш бизнес связан с экспортом автомобилей, мы предлагаем решение, которое сделает этот процесс простым, прозрачным и безопасным.
    Вместо мелких отправок вы можете заказать целый контейнер через нашу компанию."
    buttonText="Оставить заявку"
    buttonLink="/create-order"
    info={[
    {
      title: "Контейнерные перевозки без рисков",
      description: "Полное оформление с таможней «под ключ»",
    },
    {
      title: "Гибкие условия и прозрачные цены",
      description: "",
    },
    {
      title: "Минимальные риски и полный контроль за грузом",
      description: "",
    },
    ]}
/>

      </div>
      <div className="service-hero__right">
    
          <img src={carMore}/>

      </div>
      </section>

      <ServiceVideo
  src="https://kinescope.io/embed/6im6z4zkaqzub8XcQiveK6"
  title="Экспорт автомобилей"
/>
<Benefits
  title={officialBenefits.title}
  items={officialBenefits.items}
/>

<ContainerInstructions
  data={Partnership}
  layout="column"
/>


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