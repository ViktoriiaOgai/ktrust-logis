import "./ServiceHero.css";
import Go from "@/assets/icons/go.svg?react";

import BackButton from "@/components/ui/BackButton/BackButton";
import OrderButton from "@/components/ui/OrderButton";
import ServiceInfo from "@/components/ui/ServiceInfo"; 

interface ServiceHeroProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  info: {
    title: string;
    description: string;
  }[];
}

export default function ServiceHero({
  title,
  description,
  buttonText,
  info,
}: ServiceHeroProps) {

  const scrollToPrice = () => {
    const section = document.getElementById("price");

    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80, // высота Header
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="service-hero">
      <BackButton />

      <div className="service-hero__content">
        <div className="service-hero__left">
          <h1>{title}</h1>

          <p>{description}</p>

          <div className="service-hero__info">
            {info.map((item) => (
              <ServiceInfo
                key={item.title}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>

           {buttonText && (
            <OrderButton
              className="tariffs-btn"
              onClick={scrollToPrice}
            >
              {buttonText} <Go />
            </OrderButton>
          )}
        </div>
      </div>
    </section>
  );
}