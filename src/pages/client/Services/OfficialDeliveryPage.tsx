import Header from "@/components/layouts/Header/Header";
import "@/pages/client/HomePage.css";
import "@/pages/client/Services/AirDeliveryPage.css";
import "@/components/sections/HeroContent";
import officialDelivery from "@/assets/img/OfficialDelivery.jpg"
import Calculator from "@/components/sections/Calculator";
import Footer from "@/components/layouts/Footer/Footer";
import ServiceHero from "@/components/sections/Services/ServiceHero";
import ComparisonTable from "@/components/ui/ComparisonTable";
import { Official } from "@/data/delivery/Comparison";
import FAQ from "@/components/sections/FAQ";
import { personalFaq } from "@/data/delivery/faq/Faq";
import { officialInstructions } from "@/data/delivery/instructions";
import ContainerInstructions from "@/components/sections/ContainerInstructions/ContainerInstructions";
import ServiceVideo from "@/components/sections/ServiceVideo";



export default function OfficialDeliveryPage() {

   return (
    <>
      <Header />
      <div className="service-page">
        <section className="service-page-hero">
          <div className="hero-left">
      <ServiceHero
    title="Официальный импорт"
    description=""
    buttonText="Получить расчет"
    info={[
    {
      title: "Официальный импорт без головной боли",
      description: "Полный цикл задач — от завода до вашего склада.",
    },
    ]}
/>

      </div>
      <div className="service-hero__right">
    
          <img src={officialDelivery}/>

      </div>
      </section>

   <section className="comparison-section">
  <ComparisonTable
  data={Official.official}
  equalColumns
/>
</section>
<FAQ
  title={personalFaq.title}
  description={personalFaq.description}
  items={personalFaq.items}
/>
<ContainerInstructions
  data={officialInstructions}
  layout="column"
/>

<ServiceVideo
  src="https://kinescope.io/embed/gKbLz55abm9ZByXYXxTwaf"
  title="Официальный импорт"
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