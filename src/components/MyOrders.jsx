import React from "react";
import { Link } from "react-router-dom";
import "./MyOrders.scss";

/* 좌측 네비 데이터 */
const NAV = [
  {
    label: "마이쇼핑",
    items: [
      { text: "주문/배송조회", to: "/mypage/orders", key: "orders" },
      { text: "취소/반품/교환내역", to: "/mypage/cancel" },
      { text: "거래증빙서류확인", to: "/mypage/doc" },
      { hr: true },
      { text: "장바구니", to: "/cart" },
      { text: "좋아요", to: "/likes" },
      { text: "재입고알림", to: "/restock" },
      { text: "쿠폰", to: "/mypage/coupons" },
      { text: "예치금", to: "/mypage/deposit" },
      { hr: true },
    ],
  },
  {
    label: "마이활동",
    items: [
      { text: "1:1문의내역", to: "/mypage/inquiries" },
      { text: "리뷰", to: "/mypage/reviews" },
      { text: "상품Q&A내역", to: "/mypage/product-qna" },
    ],
  },
  {
    label: "마이정보",
    items: [
      { text: "회원정보 수정", to: "/mypage/profile" },
      { text: "배송지/환불계좌", to: "/mypage/address" },
      { text: "회원탈퇴", to: "/mypage/leave" },
    ],
  },
];

const DEFAULT_ORDERS = { ordered: 0, paid: 0, ready: 0, shipping: 0, delivered: 1 };

export default function MyOrders({
  user = { name: "000님" },
  couponCount = 0,
  reserve = 0,
  orders = DEFAULT_ORDERS,
}) {
  const [navOpen, setNavOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setNavOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = navOpen ? "hidden" : prev || "";
    return () => { document.body.style.overflow = prev || ""; };
  }, [navOpen]);

  return (
    <div className="mypage--page">
      {/* 모바일 햄버거 */}
      <button
        className="mp-hamburger"
        aria-label="사이드 메뉴 열기"
        aria-expanded={navOpen}
        onClick={() => setNavOpen(true)}
      >
        <span></span><span></span><span></span>
      </button>

      {/* 딤 */}
      <div className={`mp-dim ${navOpen ? "show" : ""}`} onClick={() => setNavOpen(false)} />

      <div className="mp-container">
        {/* ===== 좌측 네비 ===== */}
        <aside className={`mp-aside ${navOpen ? "open" : ""}`}>
          <button className="mp-close" aria-label="사이드 메뉴 닫기" onClick={() => setNavOpen(false)}>×</button>
          <h1 className="mp-title">마이페이지</h1>

          {NAV.map((group, gi) => (
            <section className="mp-nav" key={gi}>
              <div className="nav-head">{group.label}</div>
              <ul className="nav-list">
                {group.items.map((it, i) =>
                  it.hr ? (
                    <li className="nav-hr" key={`hr-${i}`} aria-hidden />
                  ) : (
                    <li className={`nav-item ${it.key === "orders" ? "active" : ""}`} key={i}>
                      <Link to={it.to}>{it.text}</Link>
                    </li>
                  )
                )}
              </ul>
            </section>
          ))}
        </aside>

        {/* ===== 메인 ===== */}
        <main className="mp-main">
          {/* 상단 요약 */}
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
              </ul>
            </div>
          </section>

          {/* 주문/배송조회 헤더 */}
          <div className="sec-head">
            <div className="l">
              <strong>주문/배송조회</strong><small>(최근 3개월)</small>
            </div>
            <button className="more" type="button">더보기 &gt;</button>
          </div>

          {/* 주문/배송 레일 */}
          <OrderBar orders={orders} />

          {/* ===== 필터 ===== */}
          <OrderFilter />

          {/* 안내문(카드 밖, 아래) */}
          <p className="of-notice">
            2017년 4월 이전 주문내역 조회가 가능합니다. 주문일 기준 최대 3년, 기간은 최대 12개월로 조회됩니다.
            (2019년09월01일 이후 주문만 조회 가능)
          </p>

          {/* 데모 주문표 */}
          <OrderListSample />
        </main>
      </div>
    </div>
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

/* ===== 구매유형/주문일자/조회 버튼 레이아웃 ===== */
function OrderFilter() {
  const [type, setType] = React.useState("online");

  const today = React.useMemo(() => new Date(), []);
  const [to, setTo] = React.useState(today);
  const [from, setFrom] = React.useState(
    () => new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
  );

  const years = React.useMemo(() => {
    const y = today.getFullYear();
    return Array.from({ length: 7 }, (_, i) => y - i);
  }, [today]);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysIn = (y, m) => new Date(y, m, 0).getDate();

  const setQuick = (m) => {
    const base = new Date(to);
    base.setMonth(base.getMonth() - m);
    setFrom(base);
  };

  const patch = (setter, part) => (e) => {
    const v = Number(e.target.value);
    setter((prev) => {
      const y = part === "y" ? v : prev.getFullYear();
      const mo = part === "m" ? v : prev.getMonth() + 1;
      const maxDay = daysIn(y, mo);
      const d = Math.min(prev.getDate(), maxDay);
      return new Date(y, mo - 1, part === "d" ? v : d);
    });
  };

  return (
    <section className="orders-filter">
      <div className="of-cols">
        {/* 1열 1행: 구매유형 */}
        <div className="col-left">
          <div className="stack">
            <div className="of-label">구매유형</div>
            <div className="seg">
              <button type="button" className={type === "online" ? "on" : ""} onClick={() => setType("online")}>
                온라인몰 구매
              </button>
              <button type="button" className={type === "store" ? "on" : ""} onClick={() => setType("store")}>
                매장 구매
              </button>
            </div>
          </div>
        </div>

        {/* 1열 2행: 주문일자(아래 구매기간 퀵버튼 함께) */}
        <div className="col-mid">
          {/* 구매기간 퀵버튼 (주문일자 아래 가로줄) */}
          <div className="quick-row">
            <div className="of-label inline">구매기간</div>
            <div className="quick">
              {[1, 3, 6, 12].map((m) => (
                <button key={m} type="button" onClick={() => setQuick(m)}>{m}개월</button>
              ))}
            </div>
          </div>


          <div className="between">
            {/* From */}
            <select value={from.getFullYear()} onChange={patch(setFrom, "y")} aria-label="from year">
              {years.map((y) => <option key={`fy${y}`} value={y}>{y}</option>)}
            </select><span className="unit">년</span>
            <select value={from.getMonth() + 1} onChange={patch(setFrom, "m")} aria-label="from month">
              {months.map((m) => <option key={`fm${m}`} value={m}>{m}</option>)}
            </select><span className="unit">월</span>
            <select value={from.getDate()} onChange={patch(setFrom, "d")} aria-label="from day">
              {Array.from({ length: daysIn(from.getFullYear(), from.getMonth() + 1) }, (_, i) => i + 1)
                .map((d) => <option key={`fd${d}`} value={d}>{d}</option>)}
            </select><span className="unit">일</span>

            <span className="dash">~</span>

            {/* To */}
            <select value={to.getFullYear()} onChange={patch(setTo, "y")} aria-label="to year">
              {years.map((y) => <option key={`ty${y}`} value={y}>{y}</option>)}
            </select><span className="unit">년</span>
            <select value={to.getMonth() + 1} onChange={patch(setTo, "m")} aria-label="to month">
              {months.map((m) => <option key={`tm${m}`} value={m}>{m}</option>)}
            </select><span className="unit">월</span>
            <select value={to.getDate()} onChange={patch(setTo, "d")} aria-label="to day">
              {Array.from({ length: daysIn(to.getFullYear(), to.getMonth() + 1) }, (_, i) => i + 1)
                .map((d) => <option key={`td${d}`} value={d}>{d}</option>)}
            </select><span className="unit">일</span>
          </div>

          
        </div>

        {/* 3열 1~2행: 조회 버튼 */}
        <div className="col-right">
          <button className="btn-search" type="button">조회</button>
        </div>
      </div>
    </section>
  );
}

/* 데모 주문표 */
function OrderListSample() {
  return (
    <div className="orders-table">
      <div className="thead">
        <span>주문일자/주문번호</span>
        <span>상품</span>
        <span>수량</span>
        <span>주문금액</span>
        <span>상태</span>
      </div>

      <div className="row">
        <span className="cell">
          <b>2025.08.29</b>
          <div className="sub">YSA695655555254</div>
          <a className="link" href="#!">상세보기</a>
        </span>

        <span className="cell prod">
          <img src="https://picsum.photos/seed/a/60/60" alt="" />
          <div>
            <div className="brand">BRAND NAME</div>
            <div className="name">PRODUCT NAME</div>
            <div className="opt">옵션 OPTION NAME</div>
          </div>
        </span>

        <span className="cell">1</span>

        <span className="cell price">21,140원</span>

        <span className="cell state">
          <div className="state-top">배송완료</div>
          <button className="btn-outline">배송조회</button>
          <button className="btn-outline">리뷰작성</button>
        </span>
      </div>
    </div>
  );
}
