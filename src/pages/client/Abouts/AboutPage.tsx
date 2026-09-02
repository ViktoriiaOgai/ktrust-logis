import { useState, useEffect } from 'react';
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
import { contentService } from "@/services/contentService";
import type { CompanyInfo } from "@/services/contentService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

export default function AboutPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const info = await contentService.getCompanyInfo('about');
      setCompanyInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="service-page">
          <LoadingSpinner message="Загрузка данных..." />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="service-page">
          <EmptyState
            icon="⚠️"
            title="Ошибка загрузки"
            message={error}
            action={{
              label: 'Повторить',
              onClick: loadCompanyInfo
            }}
          />
        </div>
        <Footer />
      </>
    );
  }

  const title = companyInfo?.title || 'О компании';
  const description = companyInfo?.content || 'K-Trust Logis — лицензированная корейская логистическая компания. Доставляем любые товары из Южной Кореи в Казахстан, Россию, Узбекистан и Кыргызстан авиа- и контейнерными линиями.';

  return (
    <>
      <Header />
      <div className="service-page">
        <section className="service-page-hero">
          <div className="hero-left">
            <ServiceHero
              title={title}
              description={description}
              buttonText=""
              buttonLink="/create-order"
              info={[]}
            />
          </div>
          <div className="service-hero__right">
            <img src={About} alt="О компании" />
          </div>
        </section>
        <CompanyStats />

        <ServiceVideo
          src="https://kinescope.io/embed/uUaYLjqnCUbaPpMGqEqiHD"
          title=""
        />
        <Team />

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
