import Header from "@/components/layouts/Header/Header";
import "@/pages/client/HomePage.css";
import "@/pages/client/Services/AirDeliveryPage.css";
import "@/components/sections/HeroContent";
import personalDelivery from "@/assets/img/PersonalDelivery.jpg"
import Calculator from "@/components/sections/Calculator";
import Footer from "@/components/layouts/Footer/Footer";
import ServiceHero from "@/components/sections/Services/ServiceHero";
import PopularProducts from "@/components/sections/PopularProducts";
import ComparisonTable from "@/components/ui/ComparisonTable";
import { Comparison } from "@/data/delivery/Comparison";
import FAQ from "@/components/sections/FAQ";
import { personalFaq } from "@/data/delivery/faq/Faq";


export default function PersonalDeliveryPage() {

   return (
    <>
      <Header />
      <div className="service-page">
        <section className="service-page-hero">
          <div className="hero-left">
      <ServiceHero
    title="Личные посылки"
    description="Отправьте подарки или личные вещи родным — без нервов, переплат и “грузовой” бюрократии."
    buttonText="Сделать заявку"
    buttonLink="/create-order"
    info={[
    {
      title: "Авиа или контейнером",
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
    
          <img src={personalDelivery}/>

      </div>
      </section>

    <section id="popular" className="popular-section">
       <PopularProducts/>
</section>
<section className="comparison-section">
  <ComparisonTable data={Comparison.comparison} />
</section>
<FAQ
  title={personalFaq.title}
  description={personalFaq.description}
  items={personalFaq.items}
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