import { useRef, useState } from "react";
import "./Section01.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

/* ⚠ 이미지 경로에 공백/괄호가 있으면 브라우저가 못 읽을 수 있어
   → encodeURI로 안전하게 변환 (or 파일명을 하이픈으로 변경)
*/
const u = (p) => encodeURI(p);

/* LEFT 배너 */
const LEFT_BANNERS = [
  { id: 1, img: u("/images/banner1.png"), alt: "배너 1" },
  { id: 2, img: u("/images/banner2.png"), alt: "배너 2" },
  { id: 3, img: u("/images/banner3.png"), alt: "배너 3" },
];

/* 카테고리 */
const CATEGORIES = [
  { id: 1, img: u("/images/cat (1).png"), label: "CONTENT" },
  { id: 2, img: u("/images/cat (2).png"), label: "CONTENT" },
  { id: 3, img: u("/images/cat (3).png"), label: "CONTENT" },
  { id: 4, img: u("/images/cat (4).png"), label: "CONTENT" },
  { id: 5, img: u("/images/cat (5).png"), label: "CONTENT" },
  { id: 6, img: u("/images/cat (6).png"), label: "CONTENT" },
  { id: 7, img: u("/images/cat (7).png"), label: "CONTENT" },
  { id: 8, img: u("/images/cat (8).png"), label: "CONTENT" },
];

/* 상품 */
const PRODUCTS = [
  { id: 1, img: u("/images/p (1).png"), name: "Product Name", price: 28900, base: 32900, discount: 18 },
  { id: 2, img: u("/images/p (2).png"), name: "Product Name", price: 28900, base: 32900, discount: 18 },
  { id: 3, img: u("/images/p (3).png"), name: "Product Name", price: 28900, base: 32900, discount: 18 },
  { id: 4, img: u("/images/p (4).png"), name: "Product Name", price: 28900, base: 32900, discount: 18 },
  { id: 5, img: u("/images/p (5).png"), name: "Product Name", price: 28900, base: 32900, discount: 18 },
  { id: 6, img: u("/images/p (6).png"), name: "Product Name", price: 28900, base: 32900, discount: 18 },
  { id: 7, img: u("/images/p (7).png"), name: "Product Name", price: 28900, base: 32900, discount: 18 },
];

export default function Section01() {
  const bannerRef = useRef(null);
  const barRef = useRef(null);
  const [bIndex, setBIndex] = useState(0);
  const total = LEFT_BANNERS.length;

  return (
    <section className="sec01 container">
      <div className="sec01-grid">
        {/* LEFT → 모바일에선 최상단 가로형 */}
        <aside className="left-banner">
          <Swiper
            className="banner-swiper"
            modules={[Autoplay]}
            slidesPerView={1}
            loop={total > 1}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            onSwiper={(sw) => (bannerRef.current = sw)}
            onSlideChange={(sw) => setBIndex(sw.realIndex)}
            onAutoplayTimeLeft={(_, __, progress) => {
              if (barRef.current) barRef.current.style.width = `${(1 - progress) * 100}%`;
            }}
          >
            {LEFT_BANNERS.map((b) => (
              <SwiperSlide key={b.id}>
                <img src={b.img} alt={b.alt} loading="eager" />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="banner-bottom">
            <button className="bb-nav prev" type="button" aria-label="Prev" onClick={() => bannerRef.current?.slidePrev()}>
              ‹
            </button>
            <div className="bb-fraction" aria-live="polite" aria-atomic="true">
              {String(bIndex + 1).padStart(2, "0")}
              <span className="sep"> | </span>
              {String(total).padStart(2, "0")}
            </div>
            <button className="bb-nav next" type="button" aria-label="Next" onClick={() => bannerRef.current?.slideNext()}>
              ›
            </button>
          </div>
          <div className="bb-track"><div className="bb-bar" ref={barRef} /></div>
        </aside>

        {/* RIGHT → 모바일에선 배너 아래로, 크기 축소 */}
        <div className="right">
          <ul className="cat-strip">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <button type="button" className="cat">
                  <img src={c.img} alt={c.label} loading="lazy" />
                  <span>{c.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <h3 className="sec-title">SECTION NO.1</h3>

          <div className="product-carousel">
            <Swiper
              className="hori-swiper"
              modules={[Navigation]}
              navigation
              loop={PRODUCTS.length > 2}
              watchOverflow
              slidesPerView={2}
              slidesPerGroup={2}
              /* 👉 좁을 때 카드끼리 붙는 느낌 줄이려고 간격만 살짝 조정 */
              spaceBetween={20}
              breakpoints={{
                0:   { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 10 },
                420: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 12 },
                680: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 14 },
                980: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
              }}
            >
              {PRODUCTS.map((p) => (
                <SwiperSlide key={p.id}>
                  <article className="card">
                    <div className="thumb">
                      <img src={p.img} alt={p.name} loading="lazy" />
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
