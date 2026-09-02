import { useState, useEffect } from 'react';
import Header from "@/components/layouts/Header/Header";
import "@/pages/client/HomePage.css";
import "@/pages/client/Services/AirDeliveryPage.css";
import "@/components/sections/HeroContent";
import shutterstock_2362125 from "@/assets/img/shutterstock_2362125.jpg"
import Calculator from "@/components/sections/Calculator";
import Footer from "@/components/layouts/Footer/Footer";
import ServiceHero from "@/components/sections/Services/ServiceHero";
import { contentService } from "@/services/contentService";
import type { Service, Tariff } from "@/services/contentService";
import Table from "@/components/ui/Table";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

export default function AirDeliveryPage() {
  const [service, setService] = useState<Service | null>(null);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServiceData();
  }, []);

  const loadServiceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [serviceData, tariffsData] = await Promise.all([
        contentService.getServiceBySlug('air-delivery'),
        contentService.getTariffs('air-delivery')
      ]);

      setService(serviceData);
      setTariffs(tariffsData);
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

  if (error || !service) {
    return (
      <>
        <Header />
        <div className="service-page">
          <EmptyState
            icon="⚠️"
            title="Ошибка загрузки"
            message={error || 'Услуга не найдена'}
            action={{
              label: 'Повторить',
              onClick: loadServiceData
            }}
          />
        </div>
        <Footer />
      </>
    );
  }

  const heroInfo = service.hero_info || [];

  return (
    <>
      <Header />
      <div className="service-page">
        <section className="service-page-hero">
          <div className="hero-left">
            <ServiceHero
              title={service.hero_title || service.title}
              description={service.hero_description || service.description || ''}
              buttonText={service.hero_button_text || 'Тарифы'}
              scrollToPrice={true}
              info={heroInfo.map(info => ({
                title: info.title,
                description: info.description
              }))}
            />
          </div>
          <div className="service-hero__right">
            <img src={shutterstock_2362125} alt="Авиадоставка" />
          </div>
        </section>

        <section id="price" className="price-section">
          <h1>Тарифы авиа</h1>
          <div className="tab">
            {tariffs.map((tariff) => (
              <a
                key={tariff.id}
                href={`#${tariff.country_code}`}
                className="InfBtn"
              >
                {tariff.country_name}
              </a>
            ))}
          </div>
          {tariffs.map((tariff) => (
            <Table
              key={tariff.id}
              id={tariff.country_code}
              title={tariff.country_name}
              columns={tariff.columns}
              rows={tariff.rows || []}
              notes={tariff.notes}
            />
          ))}
        </section>

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