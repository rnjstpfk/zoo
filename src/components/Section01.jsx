import { useRef, useState } from "react";
import "./Section01.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

/* 👉 이미지 경로 정책
   - public 폴더: "/images/..." 그대로 사용
   - src/assets 에 있으면 import 해서 사용
*/
const LEFT_BANNERS = [
  { id: 1, img: "/images/banner1.png", alt: "배너 1" },
  { id: 2, img: "/images/banner2.png", alt: "배너 2" },
  { id: 3, img: "/images/banner3.png", alt: "배너 3" },
];

const CATEGORIES = [
  { id: 1, img: "/images/cat (1).png", label: "CONTENT" },
  { id: 2, img: "/images/cat (2).png", label: "CONTENT" },
  { id: 3, img: "/images/cat (3).png", label: "CONTENT" },
  { id: 4, img: "/images/cat (4).png", label: "CONTENT" },
  { id: 5, img: "/images/cat (5).png", label: "CONTENT" },
  { id: 6, img: "/images/cat (6).png", label: "CONTENT" },
  { id: 7, img: "/images/cat (7).png", label: "CONTENT" },
  { id: 8, img: "/images/cat (8).png", label: "CONTENT" },
];

/* 👉 7장까지 예시(원하는 만큼만 두면 됨) */
const PRODUCTS = [
  { id: 1, img: "/images/p (1).png", name: "Product Name", price: 28900, base: 32900, discount: 18 },
  { id: 2, img: "/images/p (2).png", name: "Product Name", price: 28900, base: 32900, discount: 18 },
  { id: 3, img: "/images/p (3).png", name: "Product Name", price: 28900, base: 32900, discount: 18 },
  { id: 4, img: "/images/p (4).png", name: "Product Name", price: 28900, base: 32900, discount: 18 },
  { id: 5, img: "/images/p (5).png", name: "Product Name", price: 28900, base: 32900, discount: 18 },
  { id: 6, img: "/images/p (6).png", name: "Product Name", price: 28900, base: 32900, discount: 18 },
  { id: 7, img: "/images/p (7).png", name: "Product Name", price: 28900, base: 32900, discount: 18 },
];

export default function Section01() {
  // 왼쪽 배너 하단 커스텀 컨트롤(버튼/프랙션/바)을 위한 상태
  const bannerRef = useRef(null);
  const [bIndex, setBIndex] = useState(0);
  const total = LEFT_BANNERS.length;
  const progress = total > 1 ? (bIndex / (total - 1)) * 100 : 100;

  return (
    <section className="sec01 container">
      <div className="sec01-grid">
        {/* LEFT: 가로 슬라이드 배너 */}
        <aside className="left-banner">
          <Swiper
            className="banner-swiper"
            modules={[Autoplay]}           // 기본 화살표 제거
            slidesPerView={1}
            loop
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            onSwiper={(sw) => (bannerRef.current = sw)}
            onSlideChange={(sw) => setBIndex(sw.realIndex)}
          >
            {LEFT_BANNERS.map((b) => (
              <SwiperSlide key={b.id}>
                <img src={b.img} alt={b.alt} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 하단 컨트롤: 좌/우 + 01 | 03 */}
          <div className="banner-bottom">
            <button
              className="bb-nav prev"
              type="button"
              aria-label="Prev"
              onClick={() => bannerRef.current?.slidePrev()}
            >
              ‹
            </button>

            <div className="bb-fraction">
              {String(bIndex + 1).padStart(2, "0")}
              <span className="sep"> | </span>
              {String(total).padStart(2, "0")}
            </div>

            <button
              className="bb-nav next"
              type="button"
              aria-label="Next"
              onClick={() => bannerRef.current?.slideNext()}
            >
              ›
            </button>
          </div>

          {/* 하단 전체 길이 진행바 */}
          <div className="bb-track">
            <div className="bb-bar" style={{ width: `${progress}%` }} />
          </div>
        </aside>

        {/* RIGHT: 카테고리 + 2개씩 슬라이더(상단 바 없음) */}
        <div className="right">
          <ul className="cat-strip">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <button type="button" className="cat">
                  <img src={c.img} alt={c.label} />
                  <span>{c.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <h3 className="sec-title">SECTION NO.1</h3>

          <div className="product-carousel">
            <Swiper
              className="hori-swiper"
              style={{ minHeight: 360 }}
              modules={[Navigation]}
              navigation
              loop
              slidesPerView={2}
              slidesPerGroup={2}
              spaceBetween={28}
              breakpoints={{
                0: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 12 },
                680: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
                1024: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 28 },
              }}
            >
              {PRODUCTS.map((p) => (
                <SwiperSlide key={p.id}>
                  <article className="card">
                    <div className="thumb">
                      <img src={p.img} alt={p.name} />
                      <span className="badge">Sub image</span>
                    </div>
                    <div className="meta">
                      <div className="price">
                        <strong className="sale">{p.discount}%</strong>
                        <b className="now">{p.price.toLocaleString()}원</b>
                        <s className="base">{p.base.toLocaleString()}원</s>
                      </div>
                      <p className="name">{p.name}</p>
                      <p className="etc">★ 4.9 | 리뷰 199</p>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
