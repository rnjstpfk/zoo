// src/components/HeroSlider.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "./HeroSlider.scss";

const slides = [
  {
    id: 1,
    img: "/img/001.png",
  },
  {
    id: 2,
    img: "/img/002.png",
  },
  {
    id: 3,
    img: "/img/003.png",
  },
];

export default function HeroSlider() {
  return (
    <section className="hero-slider" aria-label="메인 프로모션 슬라이더">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        className="hero-swiper"
        effect="fade"
        loop
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
      >
        {slides.map((s) => (
          <SwiperSlide key={s.id}>
            <div className="slide-bg">
              <img src={s.img} alt="" />
              <div className="overlay" />
            </div>

            <div className="hero-copy">
              <p className="kicker">{s.kicker}</p>
              <h2 className="title">{s.title}</h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
