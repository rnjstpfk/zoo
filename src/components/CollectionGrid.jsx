import { useState } from "react";
import "./CollectionGrid.scss";

const mk = (id, img, name, price = 28900, base = 32900, discount = 18) => ({
    id, img, name, price, base, discount,
});

const PRODUCTS = [
    mk(1, "/images/collection/look1.png", "Product Name"),
    mk(2, "/images/collection/look2.png", "Product Name"),
    mk(3, "/images/collection/look3.png", "Product Name"),
    mk(4, "/images/collection/look4.png", "Product Name"),
    mk(5, "/images/collection/flat1.png", "Product Name"),
    mk(6, "/images/collection/flat2.png", "Product Name"),
    mk(7, "/images/collection/flat3.png", "Product Name"),
    mk(8, "/images/collection/flat4.png", "Product Name"),
    mk(6, "/images/collection/flat2.png", "Product Name"),
    mk(7, "/images/collection/flat3.png", "Product Name"),
    mk(8, "/images/collection/flat4.png", "Product Name"),
    // 필요하면 더 추가
];

export default function CollectionGrid() {
    // 👉 처음에 8개(4x2) 보이게
    const [visible, setVisible] = useState(Math.min(8, PRODUCTS.length));
    const show = PRODUCTS.slice(0, visible);

    const loadMore = () => setVisible(v => Math.min(v + 8, PRODUCTS.length));

    return (
        <section className="collection-4x2 container">
            <h2 className="subheading">Subheading</h2>
            <h3 className="title">PRODUCT NAME</h3>

            <div className="grid">
                {show.map(p => (
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
                                <s className="base">{p.base.toLocaleString()}원</s>
                                <b className="now">{p.price.toLocaleString()}원</b>
                            </div>

                            <p className="name">{p.name}</p>

                            {/* 컬러 도트 (예시 3개 고정) */}
                            <div className="dots">
                                <span style={{ background: "#1f65ff" }} />
                                <span style={{ background: "#222" }} />
                                <span style={{ background: "#bfbfbf" }} />
                            </div>

                            {/* 👇 여기 짧은 구분선 추가 */}
                            <div className="mini-divider" />

                            <div className="badges">
                                <span className="badge best">BEST</span>
                                <span className="badge">MADE</span>
                                <span className="badge">오늘출발</span>
                            </div>

                            <div className="foot">
                                <p className="etc">7,451개 구매중  |  리뷰 335</p>

                                <div className="icons">
                                    {/* heart */}
                                    <button className="icon-btn" aria-label="위시">
                                        <svg viewBox="0 0 24 24" width="18" height="18">
                                            <path
                                                d="M12.1 21.35l-1.1-.99C5.14 15.28 2 12.36 2 8.9 2 6.2 4.2 4 6.9 4c1.6 0 3.11.75 4.1 1.94C12.99 4.75 14.5 4 16.1 4 18.8 4 21 6.2 21 8.9c0 3.46-3.14 6.38-8.99 11.46l-1.01.99z"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                    {/* cart (위 넓고 아래 좁게) */}
                                    <button className="icon-btn" aria-label="장바구니">
                                        <svg viewBox="0 0 24 20" width="20" height="16">
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
                        </div>
                    </article>
                ))}
            </div>

            <div className="more-wrap">
                {visible < PRODUCTS.length ? (
                    <a href="/collection/page2" className="more">MORE +</a>
                ) : (
                    <button className="more" disabled>NO MORE</button>
                )}
            </div>

        </section>
    );
}
