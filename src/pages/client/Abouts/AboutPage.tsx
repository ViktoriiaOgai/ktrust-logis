import Header from "@/components/layouts/Header/Header";
import "@/pages/client/HomePage.css";
import "@/pages/client/Services/AirDeliveryPage.css";
import "@/components/sections/HeroContent";
import "@/pages/client/Abouts/AboutPage.css"
import About from "@/assets/img/about.jpg"
import Calculator from "@/components/sections/Calculator";
import Footer from "@/components/layouts/Footer/Footer";
import ServiceHero from "@/components/sections/Services/ServiceHero";
import ServiceVideo from "@/components/sections/ServiceVideo";
import Team from "@/components/sections/About/Team";
import CompanyStats from "@/components/sections/About/CompanyStats";



export default function AboutPage() {

   return (
    <>
      <Header />
      <div className="service-page">
        <section className="service-page-hero">
          <div className="hero-left">
      <ServiceHero
    title="О компании"
    description="K-Trust Logis — лицензированная корейская логистическая компания. Доставляем любые товары из Южной Кореи в Казахстан, Россию, Узбекистан и Кыргызстан авиа- и контейнерными линиями."
    buttonText=""
    buttonLink="/create-order"
    info={[

    ]}
/>

      </div>
      <div className="service-hero__right">
    
          <img src={About}/>

      </div>
      </section>
      <CompanyStats/>

      <ServiceVideo
  src="https://kinescope.io/embed/uUaYLjqnCUbaPpMGqEqiHD"
  title=""
/>
<Team/>


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