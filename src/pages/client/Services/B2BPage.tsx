import Header from "@/components/layouts/Header/Header";
import "@/pages/client/HomePage.css";
import "@/pages/client/Services/AirDeliveryPage.css";
import "@/components/sections/HeroContent";
import TrackMore from "@/assets/img/TrackMore.jpg"
import Calculator from "@/components/sections/Calculator";
import Footer from "@/components/layouts/Footer/Footer";
import ServiceHero from "@/components/sections/Services/ServiceHero";
import ServiceVideo from "@/components/sections/ServiceVideo";
import { B2B} from "@/data/delivery/officialBenefits";
import Benefits from "@/components/sections/Benefits";



export default function B2BPage() {

   return (
    <>
      <Header />
      <div className="service-page">
        <section className="service-page-hero">
          <div className="hero-left">
      <ServiceHero
    title="Логистика для бизнеса"
    description="Контейнерные перевозки без лишних затрат и рисков.

Предприниматели, у нас хорошие новости! Теперь вы можете отправлять целые контейнеры прямо из Кореи в СНГ без задержек и неожиданных доплат."
    buttonText="Оставить заявку"
    info={[
    {
      title: "100% прозрачность",
      description: "",
    },
    {
      title: "Лицензированная логистическая компания",
      description: "",
    },
    {
      title: "Безопасная и быстрая доставка",
      description: "",
    },
    ]}
/>

      </div>
      <div className="service-hero__right">
    
          <img src={TrackMore}/>

      </div>
      </section>

      <ServiceVideo
  src="https://kinescope.io/embed/15d3ae51-b1f4-46b6-823f-d988c1d119cf"
  title="Экспорт автомобилей"
/>
<Benefits
  title={B2B.title}
  items={B2B.items}
/>

<Calculator
  title="Получите консультацию"
  description="Оставьте заявку, наш менеджер свяжется с вами и уточнит детали"
  buttonText="Оставить заявку"
  className="order-btn"
/>
     </div>
    <Footer />
    </>
  );
}