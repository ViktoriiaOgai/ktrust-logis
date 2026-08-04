import { Navigation } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import Left from "@/assets/icons/chevron-left.svg?react";
import Right from "@/assets/icons/chevron-right.svg?react";
import TeamCard from "@/components/ui/TeamCard";

import TeamImg from "@/assets/img/TeamImg.jpg"
import "@/components/sections/About/Team.css";

export default function Team() {
  return (
    <section className="team">

      <div className="team__header">

        <div className="team-info">
          <h2>Команда K-Trust Logis</h2>

        </div>

        <div className="team__buttons">
          <button className="team-prev">
  <Left/>
</button>


          <button className="team-next">
  <Right/>
</button>
        </div>

      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".team-prev",
          nextEl: ".team-next",
        }}
        spaceBetween={0}
        slidesPerView={4}
      >
        <SwiperSlide>
        <TeamCard
              image={TeamImg}
              label="Олег Те"
            /> 
            </SwiperSlide>
        
        <SwiperSlide>
        <TeamCard
              image={TeamImg}
              label="Эйди Конекава"
            /> 
            </SwiperSlide>
         <SwiperSlide>
        <TeamCard
              image={TeamImg}
             label="Александр Кан"
            /> 
            </SwiperSlide>

        <SwiperSlide>
        <TeamCard
              image={TeamImg}
              label="Виктория Цой"
            /> 
            </SwiperSlide>

         <SwiperSlide>
        <TeamCard
              image={TeamImg}
              label="Ким Дмитрий"
            /> 
            </SwiperSlide>
         
      </Swiper>

    </section>
  );
}