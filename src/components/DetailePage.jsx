import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/product-detail.scss";

// ⬇️ 추가 (슬라이드)
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import p1 from "../assets/DetailePage/p1.jpg";
import p2 from "../assets/DetailePage/p2.jpg";
import p3 from "../assets/DetailePage/p3.jpg";
import p4 from "../assets/DetailePage/p4.jpg";
import p5 from "../assets/DetailePage/p5.jpg";
import p6 from "../assets/DetailePage/p6.jpg";

import longImg from "../assets/DetailePage/brand1.jpg";
import brandLogo from "../assets/DetailePage/BRAND_LOGO.png";
import washGuide from "../assets/DetailePage/wash_guide.png";

const MOCK = {
  title: "Product Name",
  price: 69000,
  likeCount: 741,
  couponBanner: "첫 구매 20% 쿠폰 받으러 가기",
  pointMax: "2,500원 최대적립",
  pointReview: "후기 적립",
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  images: [p1, p2, p3, p4, p5, p6],
};

const KRW = (n) => n.toLocaleString("ko-KR");

/* ───────── fixed within parent (옵션: lockForever) ───────── */
function useStickyWithinParent(parentRef, gapTop = 80, lockForever = false){
  const boxRef = useRef(null);
  const [style,setStyle] = useState({});
  const [spacerH,setSpacerH] = useState(0);

  useEffect(()=>{
    const update = () => {
      const parent = parentRef.current, box = boxRef.current;
      if(!parent || !box) return;

      const rect = parent.getBoundingClientRect();
      const start = rect.top + window.scrollY - gapTop;
      const end   = rect.top + window.scrollY + parent.offsetHeight - box.offsetHeight - gapTop;
      setSpacerH(box.offsetHeight);

      const left  = rect.left + window.scrollX;
      const width = rect.width;

      if(window.scrollY < start){
        setStyle({position:"static", width:"auto"});
      }else if(lockForever || window.scrollY < end){
        setStyle({position:"fixed", top:gapTop, left, width, zIndex:30});
      }else{
        setStyle({position:"absolute", top:parent.offsetHeight - box.offsetHeight, left:0, width});
      }
    };

    update();
    const id = setInterval(update, 250);
    window.addEventListener("scroll", update, {passive:true});
    window.addEventListener("resize", update);
    return () => {
      clearInterval(id);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  },[parentRef,gapTop,lockForever]);

  return { boxRef, style, spacerH };
}

/* ───────── tabs affix ───────── */
function useAffix(ref, top=0){
  const [style,setStyle] = useState({});
  const [ph,setPh] = useState(0);
  const pos = useRef({top:0,left:0,width:0,height:0});

  useEffect(()=>{
    const measure = () => {
      const el = ref.current; if(!el) return;
      const r = el.getBoundingClientRect();
      pos.current = {top:r.top + window.scrollY, left:r.left + window.scrollX, width:r.width, height:el.offsetHeight};
      setPh(el.offsetHeight);
    };
    const onScroll = () => {
      if(window.scrollY >= pos.current.top - top){
        setStyle({position:"fixed", top, left:0, width:"100vw", zIndex:20});
      }else setStyle({});
    };
    const onResize = () => { setStyle({}); measure(); onScroll(); };

    measure(); onScroll();
    window.addEventListener("scroll", onScroll, {passive:true});
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  },[ref,top]);

  return {style, placeholderH: ph};
}

/* ───────── UI ───────── */
function Breadcrumbs(){
  const paths = ["카테고리","세부 카테고리","Content name"];
  return (
    <nav className="pd-breadcrumbs" aria-label="breadcrumbs">
      <ul>
        {paths.map((p,i)=>(
          <li key={i} className={i===paths.length-1?"current":""}>
            {i<paths.length-1 ? <a href="#">{p}</a> : p}
            {i<paths.length-1 && <span className="sep">{">"}</span>}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Gallery({images}){
  const [idx,setIdx] = useState(0);
  const next = () => setIdx(p => (p+1)%images.length);
  const prev = () => setIdx(p => (p-1+images.length)%images.length);
  return (
    <div className="pd-gallery">
      <aside className="thumbs">
        {images.map((src,i)=>(
          <button key={i} onClick={()=>setIdx(i)} className={`thumb ${i===idx?"active":""}`}>
            <img src={src} alt={`thumb-${i}`} />
          </button>
        ))}
      </aside>
      <div className="main">
        <div className="img-wrap">
          <img src={images[idx]} alt="product" />
          <button className="nav prev" onClick={prev} aria-label="prev">‹</button>
          <button className="nav next" onClick={next} aria-label="next">›</button>
        </div>
      </div>
    </div>
  );
}

/* ───────── 사이즈 정보 ───────── */
const SIZE_TABS = ["여성용","남성용","아동용","유아","신생아"];

const SIZE_TABLE = {
  여성용: [
    ["XS","44(55)","0","44","4-6","34","80","34"],
    ["S","44(55)","2","55","6-8","36,44","85","36"],
    ["M","55(66)","4","66","8-10","38,46","90","38"],
    ["L","66(77)","6","77","10-12","40,48","95","40"],
    ["XL","77(88)","8","88L","12-20","40,44,48","100","42"],
    ["XXL","88(99)","10","-","20-24","44,48","105","44"],
  ],
  남성용: [
    ["S","90","XS","S","34","44","90","44"],
    ["M","95","S","M","36","46","95","46"],
    ["L","100","M","L","38","48","100","48"],
    ["XL","105","L","XL","40","50","105","50"],
    ["XXL","110","XL","XXL","42","52","110","52"],
  ],
  아동용: [
    ["XS","100","3T","100","-","-","-","-"],
    ["S","110","4T","110","-","-","-","-"],
    ["M","120","6","120","-","-","-","-"],
    ["L","130","8","130","-","-","-","-"],
    ["XL","140","10","140","-","-","-","-"],
  ],
  유아: [
    ["NB","50","NB","50","-","-","-","-"],
    ["S","60","3M","60","-","-","-","-"],
    ["M","70","6M","70","-","-","-","-"],
    ["L","80","12M","80","-","-","-","-"],
  ],
  신생아: [
    ["NB","50","NB","50","-","-","-","-"],
  ],
};

function SizeInfoBlock(){
  const [active, setActive] = useState(SIZE_TABS[0]);
  const [cm,setCm] = useState("");
  const [kg,setKg] = useState("");

  return (
    <section id="size" className="pd-info pd-size">
      <h3>사이즈 정보</h3>

      <div className="sz-inputs">
        <div className="inline">
          <div className="field with-unit">
            <input type="number" inputMode="numeric" placeholder="키" value={cm} onChange={(e)=>setCm(e.target.value)} />
            <span className="unit"> cm</span>
          </div>
          <div className="field with-unit">
            <input type="number" inputMode="numeric" placeholder="몸무게" value={kg} onChange={(e)=>setKg(e.target.value)} />
            <span className="unit"> kg</span>
          </div>
          <button type="button" className="btn find">사이즈 찾기</button>
        </div>
        <p className="tiny">해당 정보는 brand 및 제품 정보 제공에 기반한 가이드입니다.</p>
      </div>

      <div className="sz-tabs" role="tablist">
        {SIZE_TABS.map((t)=>(
          <button key={t} className={`tab ${active===t?"active":""}`} onClick={()=>setActive(t)} role="tab" aria-selected={active===t}>
            {t}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="size full">
          <thead>
            <tr>
              <th>구분</th><th>한국</th><th>미국</th><th>일본</th><th>영국_호칭</th><th>프랑스</th><th>이탈리아</th><th>유럽</th>
            </tr>
          </thead>
          <tbody>
            {(SIZE_TABLE[active] || []).map((row,i)=>(
              <tr key={i}>{row.map((c,ci)=><td key={ci}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ───────── 구매박스 ───────── */
function PurchaseBoxLite({
  title=MOCK.title, price=MOCK.price, likeCount=MOCK.likeCount,
  couponBanner=MOCK.couponBanner, pointMax=MOCK.pointMax, pointReview=MOCK.pointReview,
  sizes=MOCK.sizes
}){
  const [size,setSize] = useState("");
  const total = useMemo(()=>price,[price]);

  return (
    <aside className="pd-buybox lite">
      <Breadcrumbs />
      <h1 className="p-title">{title}</h1>
      <div className="p-price">₩{KRW(total)}</div>

      <button className="row banner blue" type="button">
        <span>{couponBanner}</span><span className="chev">›</span>
      </button>

      <div className="row benefit-stack">
        <div className="note white">{pointMax}</div>
        <div className="note gray">{pointReview}</div>
      </div>

      <label className="row select">
        <span className="label">사이즈</span>
        <select value={size} onChange={(e)=>setSize(e.target.value)}>
          <option value="" disabled>사이즈</option>
          {sizes.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <span className="chev">▾</span>
      </label>

      <div className="row action">
        <button className="like" type="button">♡ <span>{likeCount}</span></button>
        <button className="cart" type="button">장바구니</button>
        <button className="buy" type="button">결제하기</button>
      </div>

      <div className="post-actions">
        <div className="divider" />
        <div className="benefit-head">
          <div className="title">결제혜택</div>
          <a href="#" className="more">전체보기</a>
        </div>
        <ul className="benefit-list">
          <li>카드할인 안내</li>
          <li>5만원 이상 무료배송<br /><small>(일부 상품 및 도서 산간 지역 제외)</small></li>
          <li>도착 예정 날짜 안내 · 도착 확률 99%</li>
        </ul>
      </div>

      <div className="row total">총 금액 <strong>₩{KRW(total)}</strong></div>
    </aside>
  );
}

function DetailTabs({active,onClick}){
  const tabs = [
    {id:"info", label:"정보"},
    /* {id:"wash", label:"세탁"}, */
    {id:"size", label:"사이즈"},
    {id:"recommend", label:"추천"},
    {id:"review", label:"스냅후기"},
    {id:"qna", label:"문의"},
  ];
  return (
    <nav className="pd-tabs">
      <div className="inner">
        {tabs.map(t=>(
          <a key={t.id} href={`#${t.id}`} className={active===t.id?"active":""}
             onClick={(e)=>{e.preventDefault(); onClick(t.id);}}>
            {t.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function TabBelowLongImage({src}){
  const [open,setOpen] = useState(false);
  return (
    <section className={`pd-longimage ${open?"is-open":"is-collapsed"}`}>
      <div className="frame">
        <img src={src} alt="brand-long"/>
        {!open && <div className="fade" aria-hidden/>}
      </div>
      <div className="toggle">
        {!open
          ? <button className="btn-more" type="button" onClick={()=>setOpen(true)}>더보기</button>
          : <button className="btn-more" type="button" onClick={()=>setOpen(false)}>접기</button>}
      </div>
    </section>
  );
}

/* ───────── 추천 슬라이드 ───────── */
const RECO = Array.from({length:12}).map((_,i)=>({
  id:i+1, img:MOCK.images[i%MOCK.images.length],
  title:"Product Name", price:28900, base:32900, discount:18
}));

function ProductCarousel({items}){
  return (
    <div className="reco">
      <div className="reco-head" style={{display:"flex",justifyContent:"space-between",alignItems:"center", marginBottom:12}}>
        <h3>CONTENT NAME</h3>
        <a className="more" href="#">더보기</a>
      </div>

      <Swiper
        className="reco-swiper"
        modules={[Pagination, Autoplay]}
        slidesPerView={2}
        spaceBetween={10}
        grabCursor
        pagination={false}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        breakpoints={{
          0:   { slidesPerView: 1.05, spaceBetween: 14 },
          520: { slidesPerView: 1.3,  spaceBetween: 16 },
          768: { slidesPerView: 2,    spaceBetween: 20 },
          1200:{ slidesPerView: 3,    spaceBetween: 24 },
        }}
      >
        {items.map(it=>(
          <SwiperSlide key={it.id}>
            <article className="card">
              <div className="thumb"><img src={it.img} alt=""/></div>
              <div className="meta">
                <div className="price">
                  <b className="discount">{it.discount}%</b>
                  <b className="final"> {KRW(it.price)}</b>
                  <s className="base">{KRW(it.base)}</s>
                </div>
                <div className="name">Product Name</div>
                <div className="icons"><span className="dot"/><span className="dot"/><span className="dot"/></div>
                <div className="stats"><span className="tag">BEST</span><span className="tag">MADE</span><span className="sep">·</span><span>일반핏</span></div>
                <div className="social"><span>♡ 7,451</span><span className="sep">|</span><span>리뷰 353</span></div>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

/* ───────── 후기 & 문의 ───────── */
function EmptyReview(){
  return (
    <div className="review-block">
      <h3>후기</h3>
      <div className="empty">등록된 후기가 없습니다.</div>
    </div>
  );
}
function QnaBlock(){
  const [secret,setSecret] = useState(false);
  const [text,setText] = useState("");
  return (
    <div className="qna-block">
      <div className="qna-head"><h3>상품문의</h3><a href="#" className="more">더보기</a></div>
      <label className="secret"><input type="checkbox" checked={secret} onChange={(e)=>setSecret(e.target.checked)} /> 비밀글 제외</label>
      <div className="qna-input">
        {/* 입력창을 숨기고 버튼만 표시 */}
        {/* <input type="text" placeholder="판매자에게 물어보기" value={text} onChange={(e)=>setText(e.target.value)} /> */}
        <button type="button" className="qna-submit">판매자에게 문의하기</button>
      </div>
    </div>
  );
}

/* ───────── 5개 아코디언 그룹 ───────── */
function AccordionItem({title, children, defaultOpen=false}){
  const [open, setOpen] = useState(defaultOpen);
  const bodyRef = useRef(null);
  const [maxH, setMaxH] = useState(0);

  useEffect(()=>{
    const el = bodyRef.current;
    if(!el) return;
    if(open){ setMaxH(el.scrollHeight); }
    else { setMaxH(0); }
  },[open]);

  return (
    <div className={`acc-item ${open?"open":""}`}>
      <button type="button" className="acc-head" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>
        <span>{title}</span>
        <span className={`chev ${open?"up":""}`} aria-hidden>▾</span>
      </button>
      <div ref={bodyRef} className="acc-body" style={{maxHeight: maxH}}>
        <div className="acc-inner">
          {children}
        </div>
      </div>
    </div>
  );
}

function PolicyAccordionGroup(){
  return (
    <section className="policy-acc">
      <AccordionItem title="배송 · 교환/반품 안내">
        <h4>배송 안내</h4>
        <ul>
          <li>평일 오후 2시 이전 결제 시 당일 출고(예약/품절 제외).</li>
          <li>택배사 : CJ대한통운 / 기본 3,000원 (5만원 이상 무료).</li>
          <li>도서산간/제주 추가 운임 발생 가능.</li>
        </ul>
        <h4>교환/반품 안내</h4>
        <ul>
          <li>수령일 포함 7일 이내 신청(단순 변심 왕복 배송비 고객 부담).</li>
          <li>착용 흔적·오염·세탁·택 제거 시 교환/반품 불가.</li>
          <li>불량/오배송의 경우 판매자 부담.</li>
        </ul>
      </AccordionItem>

      <AccordionItem title="교환/반품 접수하기">
        <h4>접수 방법</h4>
        <ul>
          <li>마이페이지 &gt; 주문내역 &gt; 교환/반품 신청.</li>
          <li>수거지 정보와 사유 입력 후 접수 완료.</li>
          <li>수거 완료 후 1~3일 내 처리(영업일 기준).</li>
        </ul>
        <h4>반송 주소</h4>
        <p>(17172) 경기 용인시 처인구 백암면 가창리 434 K물류센터 3층</p>
      </AccordionItem>

      <AccordionItem title="상품 고시 정보안내">
        <h4>기본정보</h4>
        <ul>
          <li>제품소재 : 면 100%</li>
          <li>제조국 : Korea</li>
          <li>제조년월 : 2024-06</li>
        </ul>
        <h4>품질보증기준</h4>
        <p>관련 법률 및 소비자분쟁해결 기준을 따릅니다.</p>
      </AccordionItem>

      <AccordionItem title="판매자 정보">
        <ul>
          <li>상호 : ABC 주식회사</li>
          <li>대표자 : 홍길동</li>
          <li>사업자등록번호 : 123-45-67890</li>
          <li>통신판매업 : 제2024-서울강남-0000호</li>
          <li>고객센터 : 02-1234-5678 (평일 10:00~17:00)</li>
        </ul>
      </AccordionItem>

      <AccordionItem title="결제 정보">
        <ul>
          <li>무통장/카드/간편결제 지원.</li>
          <li>카드 즉시할인/무이자 할부는 결제창에서 확인.</li>
          <li>취소/환불은 결제 수단별 영업일 기준 처리.</li>
        </ul>
      </AccordionItem>
    </section>
  );
}

/* ───────── Page ───────── */
export default function ProductDetailPage(){
  const tabsRef = useRef(null);
  const {style:tabsStyle, placeholderH:tabsPH} = useAffix(tabsRef, 0);

  const rightRef = useRef(null);
  const {boxRef, style:rightStyle, spacerH} = useStickyWithinParent(rightRef, 80, true);

  const [active,setActive] = useState("info");

  const scrollToId = (id)=>{
    const el = document.getElementById(id); if(!el) return;
    const h = tabsRef.current ? tabsRef.current.offsetHeight : 0;
    const top = el.getBoundingClientRect().top + window.scrollY - h - 8;
    window.scrollTo({top, behavior:"smooth"});
  };

  useEffect(()=>{
    const ids = ["info","wash","size","recommend","review","qna"];
    const sections = ids.map(id=>document.getElementById(id)).filter(Boolean);
    const handler = ()=>{
      const h = tabsRef.current ? tabsRef.current.offsetHeight : 0;
      const y = window.scrollY + h + 16;
      let cur = ids[0];
      for(const sec of sections){ if(y >= sec.offsetTop) cur = sec.id; }
      setActive(cur);
    };
    handler();
    window.addEventListener("scroll", handler, {passive:true});
    return ()=>window.removeEventListener("scroll", handler);
  },[]);

  return (
    <main className="product-detail">
      <div className="container two-col">
        <div className="left-col">
          <Gallery images={MOCK.images} />

          <div ref={tabsRef} style={tabsStyle} className="pd-tabs-wrap">
            <DetailTabs active={active} onClick={scrollToId}/>
          </div>
          <div style={{height:tabsPH}} />

          <div className="pd-brandcard">
            <a className="card" href="#">
              <div className="left">
                <img className="thumb" src={brandLogo} alt="brand"/>
                <div className="texts">
                  <strong className="title">BRAND CONTENT NAME</strong>
                  <span className="desc">콘텐츠 설명을 넣어주세요.</span>
                </div>
              </div>
              <div className="right"><span className="chev">›</span></div>
            </a>
          </div>

          <TabBelowLongImage src={longImg} />

          <section id="info" className="pd-info">
            <div className="pd-brandlogo"><img src={brandLogo} alt="brand logo"/></div>
            <h3>브랜드 소개</h3>
            <p className="muted">브랜드 소개/룩북 링크 등을 연결하세요.</p>
          </section>

          <section id="wash" className="pd-wash">
            <img src={washGuide} alt="세탁 안내"/>
          </section>

          <SizeInfoBlock />

          <section id="recommend" className="pd-info pd-reco">
            <ProductCarousel items={RECO}/>
          </section>

          {/* ✅ 후기 + 상품문의 + 아코디언을 한 카드에 묶음 */}
          <section id="review" className="pd-info">
            <div className="qna-with-policy">
              <EmptyReview/>
              <div id="qna" /> {/* 탭 스크롤용 앵커 유지 */}
              <QnaBlock/>
              <PolicyAccordionGroup/>
            </div>
          </section>
        </div>

        <div className="right-col" ref={rightRef}>
          <div style={{height:spacerH}} aria-hidden />
          <div ref={boxRef} style={rightStyle}><PurchaseBoxLite/></div>
        </div>
      </div>
    </main>
  );
}
