import { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";

import LogoImg from "../assets/popup_logo.png";
import IconMenu from "../assets/icons/menu.png";
import IconClose from "../assets/icons/close_btn.png";
import IconSearch from "../assets/icons/seach_icon.png";
import IconFav from "../assets/icons/like_icon.png";
import IconCart from "../assets/icons/cart.png";
import IconUser from "../assets/icons/mypage_icon.png";

import "./Header.scss";

/* ▼ 모바일 아코디언에서 쓸 서브메뉴(원하는 텍스트로 바꿔도 됨) */
const SUBS = {
  menu1: ["서브1-1", "서브1-2", "서브1-3"],
  menu2: ["서브2-1", "서브2-2"],
  menu3: ["서브3-1", "서브3-2", "서브3-3"],
  menu4: ["서브4-1"],
  menu5: ["서브5-1", "서브5-2"],
  menu6: ["서브6-1"],
  menu7: [],
  menu8: [],
  menu9: [],
  menu10: [],
};

export default function Header() {
  const [showTopbar, setShowTopbar] = useState(true);
  const [navOpen, setNavOpen] = useState(false);

  // 검색 패널
  const [showSearch, setShowSearch] = useState(false);
  const [q, setQ] = useState("");
  const searchWrapRef = useRef(null);

  // 카테고리 메가메뉴(데스크톱용 그대로 유지)
  const [catOpen, setCatOpen] = useState(false);
  const catPanelRef = useRef(null);

  // ▼ 추가: 모바일 아코디언 열림 인덱스
  const [openIdx, setOpenIdx] = useState(null);
  const navListRef = useRef(null);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 990) {
        setNavOpen(false);
        setOpenIdx(null);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setNavOpen(false);
        setShowSearch(false);
        setCatOpen(false);
        setOpenIdx(null);
      }
    };
    const onClickAway = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) setShowSearch(false);
      if (catPanelRef.current && !catPanelRef.current.contains(e.target)) setCatOpen(false);
      if (navListRef.current && !navListRef.current.contains(e.target)) {
        setOpenIdx(null);
      }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClickAway);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClickAway);
    };
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (q.trim()) setShowSearch(true);
  };

  // ▼ 추가: 모바일에서만 메뉴 클릭 시 서브토글
  const handleMenuClick = (i, key, hasSubs, e) => {
    if (window.innerWidth <= 990 && hasSubs) {
      e.preventDefault();
      setOpenIdx(prev => (prev === i ? null : i));
    } else {
      // 데스크톱이나 서브가 없으면 기존 동작
      setNavOpen(false);
      setOpenIdx(null);
    }
  };

  const MENUS = [
    { key: "menu1", to: "/menu1", label: "메뉴1번" },
    { key: "menu2", to: "/menu2", label: "메뉴2번" },
    { key: "menu3", to: "/menu3", label: "메뉴3번" },
    { key: "menu4", to: "/menu4", label: "메뉴4번" },
    { key: "menu5", to: "/menu5", label: "메뉴5번" },
    { key: "menu6", to: "/menu6", label: "메뉴6번" },
    { key: "menu7", to: "/menu7", label: "메뉴7번" },
    { key: "menu8", to: "/menu8", label: "메뉴8번" },
    { key: "menu9", to: "/menu9", label: "메뉴9번" },
    { key: "menu10", to: "/menu10", label: "메뉴10번" },
  ];

  return (
    <header className={`site-header ${navOpen ? "nav-open" : ""}`}>
      {showTopbar && (
        <div className="topbar" role="status">
          <p>원하시는 내용을 입력해주세요.</p>
          <button className="topbar-close" aria-label="공지 닫기" onClick={() => setShowTopbar(false)}>×</button>
        </div>
      )}

      <div className="header-inner">
        {/* 로고 */}
        <NavLink to="/" className="logo" aria-label="홈으로">
          <img src={LogoImg} alt="사이트 로고" className="logo-img" />
        </NavLink>

        {/* 모바일 내비 토글 */}
        <button
          className="hamburger"
          aria-expanded={navOpen}
          aria-controls="global-nav"
          aria-label={navOpen ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setNavOpen(v => !v)}
        >
          <span></span><span></span><span></span>
        </button>

        {/* 내비 */}
        <nav id="global-nav" className="nav" aria-label="주요 메뉴" onClick={() => setNavOpen(false)}>
          <ul className="nav-list" ref={navListRef} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="drawer-close"
              aria-label="메뉴 닫기"
              onClick={() => { setNavOpen(false); setOpenIdx(null); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {/* ▼ 데스크톱용 카테고리: 모바일에서는 CSS로 숨김 */}
            <li className="category">
              <button
                type="button"
                className="cat-btn"
                aria-label={catOpen ? "카테고리 닫기" : "카테고리 열기"}
                onClick={(e) => { e.stopPropagation(); setCatOpen(v => !v); }}
              >
                <img src={catOpen ? IconClose : IconMenu} alt="" />
              </button>
              <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : undefined)}>
                카테고리
              </NavLink>
            </li>

            {/* ▼ 메뉴들: 데스크톱=링크, 모바일=아코디언 */}
            {MENUS.map((m, i) => {
              const subs = SUBS[m.key] || [];
              const hasSubs = subs.length > 0;
              const opened = openIdx === i;
              return (
                <li key={m.key} className={`nav-item ${opened ? "open" : ""}`}>
                  <NavLink
                    to={m.to}
                    className="nav-link"
                    onClick={(e) => handleMenuClick(i, m.key, hasSubs, e)}
                  >
                    {m.label}
                    {/* 모바일에서만 보이는 표시용 캐럿(텍스트) */}
                    {hasSubs && <span className="m-caret" aria-hidden>▾</span>}
                  </NavLink>

                  {/* 모바일에서만 보이도록 CSS로 제어 */}
                  {hasSubs && (
                    <ul className="sub-list" aria-hidden={!opened}>
                      {subs.map((s, j) => (
                        <li key={j}>
                          <NavLink to={`${m.to}/s${j + 1}`} onClick={() => setNavOpen(false)}>{s}</NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 검색 + 아이콘 */}
        <div className="actions">
          <div className="search-wrap" ref={searchWrapRef}>
            <form className="search" role="search" onSubmit={submitSearch} onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                placeholder="원하시는 내용을 검색해보세요."
                aria-label="사이트 검색"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setShowSearch(true)}
              />
              <button className="btn-search" aria-label="검색" type="submit">
                <img src={IconSearch} alt="" className="icon-img" />
              </button>
            </form>

            {showSearch && (
              <div className="search-panel">
                <div className="banner">Advertising Banner</div>
                <h4>인기 검색어</h4>
                <div className="keywords">
                  <ul>
                    <li><a href="#">1 Content</a></li>
                    <li><a href="#">1 Content</a></li>
                    <li><a href="#">1 Content</a></li>
                    <li><a href="#">1 Content</a></li>
                  </ul>
                  <ul>
                    <li><a href="#">1 Content</a></li>
                    <li><a href="#">1 Content</a></li>
                    <li><a href="#">1 Content</a></li>
                    <li><a href="#">1 Content</a></li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <NavLink className="icon-btn" to="/cart" aria-label="장바구니">
            <img src={IconCart} alt="" className="icon-img" />
          </NavLink>
          <NavLink className="icon-btn" to="/favorites" aria-label="즐겨찾기">
            <img src={IconFav} alt="" className="icon-img" />
          </NavLink>
          <NavLink className="icon-btn" to="/mypage" aria-label="마이페이지">
            <img src={IconUser} alt="" className="icon-img" />
          </NavLink>
        </div>
      </div>

      {/* ▼ 카테고리 메가메뉴(데스크톱 전용) */}
      <div
        className={`category-panel ${catOpen ? "open" : ""}`}
        ref={catPanelRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="container category-grid" style={{ ['--sub-count']: 12 }}>
          <div className="category-col title"><strong>Category</strong></div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="category-col" key={i}>
              <h5><a href="#">Main menu</a></h5>
              <ul>
                {Array.from({ length: 12 }).map((__, j) => (
                  <li key={j}><a href="#">Sub menu</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
