import { useEffect, useState } from "react";

import image1 from "@/assets/img/image1.jpg";
import image2 from "@/assets/img/image2.jpg";
import image3 from "@/assets/img/image3.jpg";
import image4 from "@/assets/img/image4.jpg";
import "@/components/sections/HeroContent.css";

export default function HeroSlider() {
  const slides = [image1, image2, image3, image4];

  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-slider">
      <img
        src={slides[current]}
        alt="delivery"
        className={visible ? "slide-in" : "slide-out"}
      />
    </div>
  );
}