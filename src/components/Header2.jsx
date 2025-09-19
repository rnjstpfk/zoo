import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "./brand-header.css";

/* 이미지 */
import LogoImg from "../assets/logo/LOGO DESIGN.png";
import IcSearch from "../assets/icons/seach_icon.png";
import IcUser from "../assets/icons/mypage_icon.png";
import IcBag from "../assets/icons/cart.png";

/* ▼ SVGs */
function CaretDown({ className }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function CloseIcon({ className }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* 메뉴 더미 */
const MAIN = [
  { label: "Main menu", subs: ["Sub menu", "Sub menu", "Sub menu", "Sub menu"] },
  { label: "Main menu", subs: ["Sub menu", "Sub menu", "Sub menu"] },
  { label: "Main menu", subs: ["Sub menu", "Sub menu", "Sub menu", "Sub menu"] },
  { label: "Main menu", subs: ["Sub menu", "Sub menu"] },
  { label: "Main menu", subs: ["Sub menu", "Sub menu", "Sub menu"] },
  { label: "Main menu", subs: ["Sub menu", "Sub menu", "Sub menu"] },
];

/* 상단 마키 문구 */
const STRIP =
  "— POPUP SLIDE — POPUP SLIDE — POPUP SLIDE — POPUP SLIDE — POPUP SLIDE — POPUP SLIDE — POPUP SLIDE — POPUP SLIDE — POPUP SLIDE — POPUP SLIDE — POPUP SLIDE — POPUP SLIDE — POPUP SLIDE";

export default function BrandHeader() {
  const [askOpen, setAskOpen] = useState(false);
  const askRef = useRef(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const searchBoxRef = useRef(null);

  // 모바일 전용 상태
  const [navOpen, setNavOpen] = useState(false);
  const [openSubs, setOpenSubs] = useState(new Set());

  // 클릭 밖/ESC 처리 + 리사이즈 시 정리
  useEffect(() => {
    const onClickAway = (e) => {
      if (askRef.current && !askRef.current.contains(e.target)) setAskOpen(false);
      if (searchOpen && searchBoxRef.current && !searchBoxRef.current.contains(e.target)) setSearchOpen(false);
    };
    const onEscape = (e) => {
      if (e.key === "Escape") {
        setAskOpen(false);
        setSearchOpen(false);
        setNavOpen(false);
        setOpenSubs(new Set());
      }
    };
    const onResize = () => {
      // 데스크탑 복귀 시 모바일 상태 초기화
      if (window.innerWidth > 640) {
        setNavOpen(false);
        setOpenSubs(new Set());
      }
    };
    document.addEventListener("click", onClickAway);
    document.addEventListener("keydown", onEscape);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("click", onClickAway);
      document.removeEventListener("keydown", onEscape);
      window.removeEventListener("resize", onResize);
    };
  }, [searchOpen]);

  const toggleSub = (idx) => {
    setOpenSubs((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  return (
    <header className="bh">
      {/* 상단 마키 (무한루프) */}
      <div className="bh-topstrip" role="presentation" aria-hidden="true">
        <div className="bh-marquee">
          <div className="bh-track">
            <div className="bh-seq"><span>{STRIP}</span></div>
            <div className="bh-seq" aria-hidden="true"><span>{STRIP}</span></div>
          </div>
        </div>
      </div>

      {/* 로고/유틸 바 */}
      <div className="bh-bar container">
        <div className="bh-left"><p>관심상품 0개</p></div>

        <NavLink to="/" className="bh-logo" aria-label="홈">
          <img src={LogoImg} alt="LOGO DESIGN" />
        </NavLink>

        <div className="bh-right">
          <NavLink to="/signup" className="bh-util">회원가입</NavLink>
          <NavLink to="/login" className="bh-util">로그인</NavLink>
          <NavLink to="/orders" className="bh-util">주문조회</NavLink>
          <NavLink to="/recent" className="bh-util">최근본상품</NavLink>

          {/* ask 드롭다운 */}
          <div className="bh-ask" ref={askRef}>
            <button
              className="bh-ask-btn"
              aria-expanded={askOpen}
              aria-haspopup="menu"
              onClick={(e) => { e.stopPropagation(); setAskOpen(v => !v); }}
            >
              ask <CaretDown className={`bh-caret ${askOpen ? "open" : ""}`} />
            </button>
            {askOpen && (
              <div className="bh-ask-menu" role="menu">
                <NavLink to="/notice" className="bh-ask-item" role="menuitem">notice</NavLink>
                <NavLink to="/review" className="bh-ask-item" role="menuitem">review</NavLink>
                <NavLink to="/qna" className="bh-ask-item" role="menuitem">Q&amp;A</NavLink>
              </div>
            )}
          </div>

          {/* 검색/마이페이지/장바구니 */}
          <NavLink
            to="/search" className="bh-icon1" aria-label="검색"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSearchOpen(true); }}
          >
            <img src={IcSearch} alt="" />
          </NavLink>
          <NavLink to="/mypage" className="bh-icon2" aria-label="마이페이지">
            <img src={IcUser} alt="" />
          </NavLink>
          <NavLink to="/cart" className="bh-icon3" aria-label="장바구니">
            <img src={IcBag} alt="" />
          </NavLink>
        </div>
      </div>

      {/* ===== 메인 내비게이션 ===== */}
      <nav className={`bh-nav ${navOpen ? "open" : ""}`} aria-label="메인 메뉴">
        <div className="container bh-nav-inner">
          {/* 모바일: 햄버거 */}
          <button
            className="bh-hamburger"
            aria-label="메뉴 열기"
            aria-expanded={navOpen}
            aria-controls="bh-drawer"
            onClick={() => setNavOpen(true)}
          >
            <span /><span /><span />
          </button>

          {/* 데스크톱 메뉴 (기존 유지) */}
          <ul className="bh-menu">
            {MAIN.map((m, i) => (
              <li className="bh-item" key={i}>
                <a className="bh-link" href="#">{m.label}</a>
                <div className="bh-dropdown" role="menu">
                  {m.subs.map((s, j) => (
                    <a className="bh-drop-link" href="#" role="menuitem" key={j}>{s}</a>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          {/* 모바일 드로어 */}
          <div id="bh-drawer" className={`bh-drawer ${navOpen ? "show" : ""}`} role="dialog" aria-modal="true">
            <div className="bh-drawer-head">
              <span className="bh-drawer-title">Menu</span>
              <button className="bh-mobile-close" aria-label="닫기" onClick={() => { setNavOpen(false); setOpenSubs(new Set()); }}>
                <CloseIcon />
              </button>
            </div>

            <ul className="bh-drawer-list">
              {MAIN.map((m, i) => {
                const opened = openSubs.has(i);
                return (
                  <li key={i} className={`bh-drawer-item ${opened ? "open" : ""}`}>
                    <button
                      type="button"
                      className="bh-drawer-link"
                      onClick={() => toggleSub(i)}
                      aria-expanded={opened}
                      aria-controls={`sub-${i}`}
                    >
                      <span>{m.label}</span>
                      <CaretDown className={`bh-drawer-caret ${opened ? "open" : ""}`} />
                    </button>
                    <div id={`sub-${i}`} className="bh-drawer-subwrap" style={{ maxHeight: opened ? "400px" : "0px" }}>
                      {m.subs.map((s, j) => (
                        <a key={j} href="#" className="bh-drawer-sublink">{s}</a>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 모바일: 딤 오버레이 */}
          <button
            className={`bh-dim ${navOpen ? "show" : ""}`}
            aria-hidden={!navOpen}
            onClick={() => { setNavOpen(false); setOpenSubs(new Set()); }}
          />
        </div>
      </nav>

      {/* 검색 오버레이 (상단 절반만 덮음) */}
      <div className={`bh-ol ${searchOpen ? "open" : ""}`} aria-hidden={!searchOpen}>
        <div className="bh-ol-bg" onClick={() => setSearchOpen(false)} />
        <div
          className="bh-ol-center"
          ref={searchBoxRef}
          onClick={(e) => e.stopPropagation()}
          role="dialog" aria-modal="true"
        >
          <button className="bh-ol-close" aria-label="닫기" onClick={() => setSearchOpen(false)}>
            <CloseIcon />
          </button>
          <input
            type="text"
            className="bh-ol-input"
            placeholder="검색어를 입력하세요"
            autoFocus={searchOpen}
          />
        </div>
      </div>
    </header>
  );
}
