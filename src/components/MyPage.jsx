import React from "react";
import "./MyPage.scss";

/* ========= 좌측 네비 데이터 (구분선 포함) ========= */
const NAV = [
  {
    label: "마이쇼핑",
    items: [
      "주문/배송조회",
      "취소/반품/교환내역",
      "거래증빙서류확인",
      { hr: true },
      "장바구니",
      "좋아요",
      "재입고알림",
      "쿠폰",
      "예치금",
      { hr: true },
    ],
  },
  {
    label: "마이활동",
    items: ["1:1문의내역", "리뷰", "상품Q&A내역"],
  },
  {
    label: "마이정보",
    items: ["회원정보 수정", "배송지/환불계좌", "회원탈퇴"],
  },
];

/* 페이지 본문 기본값(동일) */
const DEFAULT_ORDERS = { ordered: 0, paid: 0, ready: 0, shipping: 0, delivered: 1 };

export default function MyPage({
  user = { name: "000님" },
  couponCount = 0,
  reserve = 0,
  points = 300,
  orders = DEFAULT_ORDERS,
  likes = [], inquiries = [], productQnas = [],
}) {
  /* 햄버거 오픈 상태 */
  const [navOpen, setNavOpen] = React.useState(false);

  /* ESC로 닫기 */
  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setNavOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* 메뉴 열릴 때 바디 스크롤 잠금 */
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = navOpen ? "hidden" : prev || "";
    return () => { document.body.style.overflow = prev || ""; };
  }, [navOpen]);

  return (
    <div className="mypage--page">
      {/* 모바일 전용 햄버거 버튼 */}
      <button
        className="mp-hamburger"
        aria-label="사이드 메뉴 열기"
        aria-expanded={navOpen}
        onClick={() => setNavOpen(true)}
      >
        <span></span><span></span><span></span>
      </button>

      {/* 딤 오버레이 */}
      <div className={`mp-dim ${navOpen ? "show" : ""}`} onClick={() => setNavOpen(false)} />

      <div className="mp-container">
        {/* ===== 좌측 네비 ===== */}
        <aside className={`mp-aside ${navOpen ? "open" : ""}`}>
          {/* 모바일에서만 보이는 닫기 버튼 */}
          <button className="mp-close" aria-label="사이드 메뉴 닫기" onClick={() => setNavOpen(false)}>×</button>

          <h1 className="mp-title">마이페이지</h1>

          {NAV.map((group, gi) => (
            <section className="mp-nav" key={gi}>
              <div className="nav-head">{group.label}</div>

              {/* ✅ 전역 CSS 충돌 회피: 클래스명을 mp-nav-list/mp-nav-item/mp-nav-hr 로 변경 */}
              <ul className="mp-nav-list">
                {group.items.map((it, i) =>
                  typeof it === "string" ? (
                    <li className="mp-nav-item" key={i}>
                      <a href="#!">{it}</a>
                    </li>
                  ) : (
                    <li className="mp-nav-hr" key={`hr-${i}`} aria-hidden />
                  )
                )}
              </ul>
            </section>
          ))}
        </aside>

        {/* ===== 메인(기존 내용 그대로) ===== */}
        <main className="mp-main">
          {/* 상단 배너 */}
          <section className="mp-summary">
            <div className="summary-head">
              <div className="avatar" aria-hidden>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </div>
              <b>{user.name}</b>&nbsp;반갑습니다.
            </div>
            <div className="summary-body">
              <ul className="mini">
                <li>쿠폰 <em className="red">{couponCount}</em> 개</li>
                <li>예치금 <em className="red">{reserve.toLocaleString()}</em> 원</li>
                {/* <li>적립금 <em className="red">{points.toLocaleString()}</em> P</li> */}
              </ul>
            </div>
          </section>

          {/* 주문/배송조회 */}
          <div className="sec-head">
            <div className="l">
              <strong>주문/배송조회</strong><small>(최근 3개월)</small>
            </div>
            <button className="more" type="button">더보기 &gt;</button>
          </div>
          <OrderBar orders={orders} />

          {/* 좋아요 */}
          <div className="sec-head">
            <div className="l"><strong>좋아요</strong></div>
            <button className="more" type="button">더보기 &gt;</button>
          </div>
          {likes.length === 0 ? (
            <EmptyLike />
          ) : (
            <ul className="like-grid">
              {likes.map(it => (
                <li key={it.id}>
                  <a href={it.href || `/product/${it.id}`}>
                    <img src={it.img} alt={it.name} />
                    <p className="name">{it.name}</p>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* 하단 두 칼럼 */}
          <div className="mp-bottom">
            <BottomList title="1:1 문의내역" data={inquiries} />
            <BottomList title="상품Q&A내역" data={productQnas} />
          </div>
        </main>
      </div>
    </div>
  );
}

/* 하단 리스트 컴포넌트 */
function BottomList({ title, data }) {
  return (
    <section className="bottom-card">
      <div className="sec-head tight">
        <div className="l"><strong>{title}</strong></div>
        <button className="more" type="button">더보기 &gt;</button>
      </div>
      {data.length ? (
        <ul className="table-lite">
          {data.map(x => (
            <li key={x.id}>
              <span className="dot">•</span>
              <a className="subject" href={x.href || "#!"}>
                <span className={`pill ${x.state}`}>{x.state === "done" ? "답변완료" : "대기"}</span>
                <span className="txt">{x.subject}</span>
              </a>
              <time>{x.date}</time>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-line">최근 1개월간 문의하신 내용이 없습니다.</p>
      )}
    </section>
  );
}

/* 주문/배송 레일 */
function OrderBar({ orders }) {
  const steps = [
    { key: "ordered",   label: "주문접수" },
    { key: "paid",      label: "결제완료" },
    { key: "ready",     label: "배송준비중" },
    { key: "shipping",  label: "배송중" },
    { key: "delivered", label: "배송완료" },
  ];
  return (
    <div className="orderbar">
      {steps.map((s, i) => (
        <React.Fragment key={s.key}>
          <div className="cell">
            <div className={`num ${s.key === "delivered" ? "violet" : ""}`}>
              {orders[s.key] ?? 0}
            </div>
            <div className="lab">{s.label}</div>
          </div>
          {i < steps.length - 1 && <span className="sep">›</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function EmptyLike() {
  return (
    <div className="like-empty">
      <div className="circle">!</div>
      <p>좋아요 상품이 없습니다.</p>
    </div>
  );
}
