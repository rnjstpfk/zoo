import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ 추가
import "./ProductGrid.scss";

const FILE_PREFIX = "/images/item"; // 필요하면 "/images/iteam" 등으로 변경
const FILE_EXT = ".png";

const PRODUCTS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  img: `${FILE_PREFIX}${((i % 14) + 1)}${FILE_EXT}`,
  name: "Product Name",
  price: 28900,
  base: 32900,
  discount: 18,
  rating: 4.9,
  reviews: 335,
  purchases: 2457,
  badges: ["BEST", "MADE", "오늘출발"],
}));

export default function ProductGrid() {
  const [likes, setLikes] = useState(new Set());

  const toggleLike = (id) => {
    setLikes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addToCart = (p) => {
    alert(`장바구니 담기: ${p.name} (${p.price.toLocaleString()}원)`);
  };

  // ✅ 페이지네이션: URL 쿼리(page)만 변경
  const navigate = useNavigate();
  const location = useLocation();
  const TOTAL_PAGES = 4; // 표시할 페이지 수 (원하는 만큼)
  const getCurrentPage = () => {
    const sp = new URLSearchParams(location.search);
    const n = Number(sp.get("page")) || 1;
    return Math.max(1, Math.min(n, TOTAL_PAGES));
  };
  const currentPage = getCurrentPage();
  const goPage = (n) => {
    const sp = new URLSearchParams(location.search);
    sp.set("page", String(Math.max(1, Math.min(n, TOTAL_PAGES))));
    navigate({ pathname: location.pathname, search: sp.toString() });
  };

  return (
    <section className="product-grid container">
      <h2 className="subheading">Subheading</h2>
      <h3 className="title">PRODUCT NAME</h3>

      <div className="grid">
        {PRODUCTS.map((p) => {
          const liked = likes.has(p.id);
          return (
            <article key={p.id} className="card">
              <div className="thumb">
                <img
                  src={p.img}
                  alt={p.name}
                  onError={(e) => (e.currentTarget.src = "/images/placeholder.png")}
                />
              </div>

              <div className="meta">
                <div className="price">
                  <strong className="sale">{p.discount}%</strong>
                  <b className="now">{p.price.toLocaleString()}원</b>
                  <s className="base">{p.base.toLocaleString()}원</s>
                </div>

                <p className="name">{p.name}</p>

                <div className="badges">
                  {p.badges.map((b, i) => (
                    <span key={i} className="badge">{b}</span>
                  ))}
                </div>

                <p className="etc">
                  ★ {p.rating} | 리뷰 {p.reviews}
                  <span className="dot">·</span>
                  {p.purchases.toLocaleString()}개 구매중
                </p>

                {/* ====== 액션 버튼: SVG 하트/장바구니 ====== */}
                <div className="actions">
                  <button
                    type="button"
                    aria-pressed={liked}
                    aria-label={liked ? "위시 해제" : "위시에 추가"}
                    className={`icon-btn heart ${liked ? "liked" : ""}`}
                    onClick={() => toggleLike(p.id)}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path
                        className="heart-fill"
                        d="M12.1 21.35l-1.1-.99C5.14 15.28 2 12.36 2 8.9 2 6.2 4.2 4 6.9 4c1.6 0 3.11.75 4.1 1.94C12.99 4.75 14.5 4 16.1 4 18.8 4 21 6.2 21 8.9c0 3.46-3.14 6.38-8.99 11.46l-1.01.99z"
                      />
                      <path
                        className="heart-stroke"
                        d="M12.1 21.35l-1.1-.99C5.14 15.28 2 12.36 2 8.9 2 6.2 4.2 4 6.9 4c1.6 0 3.11.75 4.1 1.94C12.99 4.75 14.5 4 16.1 4 18.8 4 21 6.2 21 8.9c0 3.46-3.14 6.38-8.99 11.46l-1.01.99z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    aria-label="장바구니 담기"
                    className="icon-btn cart"
                    onClick={() => addToCart(p)}
                  >
                    <svg viewBox="0 0 24 20" width="22" height="18">
                      <path
                        d="M4 7h16l-1.8 7a2 2 0 0 1-2 1.3H7.8a2 2 0 0 1-2-1.3L4 7z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 7V5.5a3 2.5 0 0 1 8 0V7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* ✅ 숫자 클릭 시 URL 쿼리만 변경 */}
      <div className="pagination">
        <button onClick={() => goPage(currentPage - 1)} disabled={currentPage === 1}>
          &lt;
        </button>

        {Array.from({ length: TOTAL_PAGES }, (_, i) => {
          const n = i + 1;
          return (
            <button
              key={n}
              className={currentPage === n ? "active" : ""}
              onClick={() => goPage(n)}
            >
              {n}
            </button>
          );
        })}

        <button
          onClick={() => goPage(currentPage + 1)}
          disabled={currentPage === TOTAL_PAGES}
        >
          &gt;
        </button>
      </div>
    </section>
  );
}
