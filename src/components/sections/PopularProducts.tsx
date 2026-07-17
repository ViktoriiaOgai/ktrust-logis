import { Navigation } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "@/components/ui/ProductCard";

import cosm from "@/assets/img/cosm.png";
import vitam from "@/assets/img/vitam.png";
import auto from "@/assets/img/auto.png";
import clothes from "@/assets/img/clothes.png";
import electronics from "@/assets/img/electronics.png";
import boxes from "@/assets/img/boxes.png";
import shoes from "@/assets/img/shoes.png";
import household from "@/assets/img/household.png";

import "@/components/sections/PopularProducts.css";

export default function PopularProducts() {
  return (
    <section className="popular-products">

      <div className="popular-products__header">

        <div className="products-info">
          <h2>Популярные товары</h2>

          <p>
            От косметики и одежды до электроники и
            хозтоваров — доставляем любые посылки.
          </p>
        </div>

        <div className="popular-products__buttons">
          <button className="products-prev">
  ←
</button>


          <button className="products-next">
  →
</button>
        </div>

      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".products-prev",
          nextEl: ".products-next",
        }}
        spaceBetween={0}
        slidesPerView={4}
      >
        <SwiperSlide>
        <ProductCard
              image={cosm}
              title="Косметика"
              to="/products/cosm"
            />
            </SwiperSlide>
            <SwiperSlide>
        <ProductCard
              image={vitam}
                    title="Витамины и Бады"
                    to="/products/vitamins"
            />
            </SwiperSlide>
        <SwiperSlide>
          <ProductCard
            image={auto}
            title="Автозапчасти"
            to="/products/auto"
          />
        </SwiperSlide>

        <SwiperSlide>
          <ProductCard
            image={clothes}
            title="Одежда"
            to="/products/clothes"
          />
        </SwiperSlide>

        <SwiperSlide>
          <ProductCard
            image={electronics}
            title="Электроника"
            to="/products/electronics"
          />
        </SwiperSlide>
        <SwiperSlide>
          <ProductCard
                image={boxes}
                title="Личные вещи"
                to="/products/boxes"
              />
        </SwiperSlide>

        <SwiperSlide>
          <ProductCard
                image={shoes}
                title="Обувь"
                to="/products/shoes"
              />
        </SwiperSlide>
        <SwiperSlide>
          <ProductCard
      image={household}
      title="Обувь"
      to="/products/household"
    />
        </SwiperSlide>

      </Swiper>

    </section>
  );
}