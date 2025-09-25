import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/product-detail-compact.scss";

/* 갤러리 8장: 파일만 교체해서 쓰세요 */
import g1 from "../assets/Compact/g1.jpg";
import g2 from "../assets/Compact/g2.jpg";
import g3 from "../assets/Compact/g3.jpg";
import g4 from "../assets/Compact/g4.jpg";
import g5 from "../assets/Compact/g5.jpg";
import g6 from "../assets/Compact/g6.jpg";
import g7 from "../assets/Compact/g7.jpg";
import g8 from "../assets/Compact/g8.jpg";

/* 하단 긴 이미지(갤러리와 별개) */
import d1 from "../assets/Compact/p1.jpg";
import d2 from "../assets/Compact/p2.jpg";
import d3 from "../assets/Compact/p3.jpg";
import d4 from "../assets/Compact/p4.jpg";
import d5 from "../assets/Compact/p5.jpg";

const KRW = (n) => n.toLocaleString("ko-KR");

/* ───────── 고정 훅 (폭/좌표는 anchorRef, 멈춤은 parentRef로 계산) ───────── */
function useStickyWithinParent(
  parentRef,
  anchorRef,
  gapTop = 0,
  { stickFromStart = true, stopAtEnd = true, disableBelow = 1024 } = {}
){
  const boxRef = useRef(null);
  const [style,setStyle] = useState({});
  const [spacerH,setSpacerH] = useState(0);

  useEffect(()=>{
    const update = () => {
      const parent = parentRef.current;
      const anchor = (anchorRef?.current) || parent;
      const box = boxRef.current;
      if(!parent || !anchor || !box) return;

      if (window.innerWidth <= disableBelow){
        setStyle({position:"static", width:"auto"});
        setSpacerH(0);
        return;
      }

      setSpacerH(box.offsetHeight);

      const pRect = parent.getBoundingClientRect();
      const parentTop = pRect.top + window.scrollY;
      const end = parentTop + parent.offsetHeight - box.offsetHeight - gapTop;

      const aRect = anchor.getBoundingClientRect();
      const left  = aRect.left + window.scrollX;
      const width = aRect.width;

      const start = stickFromStart ? -Infinity : (parentTop - gapTop);

      if (stopAtEnd && window.scrollY >= end){
        setStyle({position:"absolute", top:parent.offsetHeight - box.offsetHeight, left:0, width});
      } else if (window.scrollY >= start){
        setStyle({position:"fixed", top:gapTop, left, width, zIndex:30});
      } else {
        setStyle({position:"static", width:"auto"});
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
  },[parentRef,anchorRef,gapTop,stickFromStart,stopAtEnd,disableBelow]);

  return { boxRef, style, spacerH };
}

/* ───────── 상단 갤러리 ───────── */
function GalleryCompact({ images, rating = 4.8, reviewCount = 166 }) {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx((p) => (p + 1) % images.length);
  const prev = () => setIdx((p) => (p - 1 + images.length) % images.length);
  const fillPercent = Math.max(0, Math.min(100, (rating / 5) * 100));

  return (
    <section className="cd-gallery">
      <div className="main">
        <img src={images[idx]} alt={`main-${idx}`} />
        <button className="nav prev" onClick={prev} aria-label="prev">‹</button>
        <button className="nav next" onClick={next} aria-label="next">›</button>
      </div>

      <div className="photoReview">
        <p>PHOTO REVIEW</p>
      </div>

      <div className="thumb-rail">
        {/* 별점 카드 */}
        <div className="rating-tile">
          <div className="score">{rating.toFixed(1)}</div>
          <div className="stars" style={{ ["--rate"]: `${fillPercent}%` }}>
            <span className="off">★★★★★</span>
            <span className="on"  style={{ width: `var(--rate)` }}>★★★★★</span>
          </div>
          <div className="cnt">{reviewCount}개</div>
        </div>

        <div className="thumbs">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              className={`thumb ${i === idx ? "active" : ""}`}
              onClick={() => setIdx(i)}
            >
              <img src={src} alt={`thumb-${i}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── 오른쪽 구매 박스 ───────── */
function CompactBuyBox({
  title = "Product Name (1cm/4colors+3colors) 40%",
  basePrice = 79000,
  salePrice = 47400,
}){
  const [opt1,setOpt1] = useState("");
  const [opt2,setOpt2] = useState("");
  const [opt3,setOpt3] = useState("");
  const [opt4,setOpt4] = useState("");
  const [opt5,setOpt5] = useState("");
  const [opt6,setOpt6] = useState("");
  const [opt7,setOpt7] = useState("");
  const [opt8,setOpt8] = useState("");
  const sizes = ["size01","size02","size03","size04","size05","size06"];
  const [selSize, setSelSize] = useState("");

  const total = useMemo(()=> salePrice, [salePrice]);

  return (
    <aside className="compact-buybox">
      <div className="topline">
        <h1 className="title">{title}</h1>
        <button className="wish" aria-label="like">♡</button>
      </div>

      <div className="price-area">
        <div className="base">₩{KRW(basePrice)}</div>
        <div className="final">₩{KRW(total)}</div>
      </div>

      <div className="ship">배송비 <b>3,000원</b> (50,000원 이상 구매 시 무료)</div>

      <div className="options">
        <select value={opt1} onChange={e=>setOpt1(e.target.value)}>
          <option value="" disabled>Option no1</option>
        </select>
        <select value={opt2} onChange={e=>setOpt2(e.target.value)}>
          <option value="" disabled>Option no2</option>
        </select>
        <select value={opt3} onChange={e=>setOpt3(e.target.value)}>
          <option value="" disabled>Option no3</option>
        </select>
        <select value={opt4} onChange={e=>setOpt4(e.target.value)}>
          <option value="" disabled>Option no4</option>
        </select>
        <select value={opt5} onChange={e=>setOpt5(e.target.value)}>
          <option value="" disabled>Option no5</option>
        </select>
        <select value={opt6} onChange={e=>setOpt6(e.target.value)}>
          <option value="" disabled>Option no6</option>
        </select>
        <select value={opt7} onChange={e=>setOpt7(e.target.value)}>
          <option value="" disabled>Option no7</option>
        </select>
        <select value={opt8} onChange={e=>setOpt8(e.target.value)}>
          <option value="" disabled>Option no8</option>
        </select>
      </div>

      <div className="sizes">
        {sizes.map(s => (
          <button
            key={s}
            type="button"
            className={`chip ${selSize===s?"on":""}`}
            onClick={()=>setSelSize(selSize===s?"":s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="cta">
        <button className="cart" type="button">CART</button>
        <button className="buy" type="button">BUY NOW</button>
      </div>
    </aside>
  );
}

/* ───────── 활용 가이드 ───────── */
function ReviewGuide(){
  return (
    <section className="review-guide">
      <h3><span className="blue">리뷰로</span> 보는 활용 가이드</h3>
      <p className="lead">저희 브랜드 플랫은 겨울철에도 따뜻하게 착용할 수 있으며, 다양한 스타일에 쉽게 매치됩니다. 사용자들은 특히 착화감에 만족하며, 장시간 착용에도 편안함을 극찬하고 있습니다.</p>
      <div className="pills"><span className="pill">겨울철 적합</span><span className="pill">편안한 착화감</span><span className="pill">다양한 스타일 매치</span><span className="pill">장시간 착용 가능</span></div>
      <hr />
      <div className="rows">
        <div className="row"><b>사용자 유형</b><span>다양한 스타일을 즐기는 패션 관심층</span></div>
        <div className="row"><b>구매 이유</b><span>겨울철에도 착용 가능한 안정된 보온성</span></div>
        <div className="row"><b>사용자 유형</b><span>다양한 코디에 매치하여 데일리 슈즈로 활용</span></div>
        <div className="row"><b>사용자 유형</b><span>장시간 외출/근무에도 편안하게 착용 가능</span></div>
      </div>
      <div className="note">* 위 내용은 구매리뷰의 후기 데이터를 요약했습니다.</div>
    </section>
  );
}

/* ───────── 리뷰/문의 – 요청한 형태로 수정 ───────── */
function StarBadge({score=4.8, count=166}){
  const pct = Math.max(0, Math.min(100, (score/5)*100));
  return (
    <div className="score-badge">
      <div className="n">{score.toFixed(1)}</div>
      <div className="stars">
        <span className="bg">★★★★★</span>
        <span className="fill" style={{width:`${pct}%`}}>★★★★★</span>
      </div>
      <div className="c">{count}개</div>
    </div>
  );
}

function ReviewSummary({images}){
  return (
    <div className="rv-summary">
      <div className="row1">
        <StarBadge />
        <div className="bars">
          {[
            ["아주 좋아요", 139],
            ["좋아요",      12],
            ["보통이에요",   4],
            ["별로예요",     1],
            ["아쉬워요",     0],
          ].map(([label,val],i)=>(
            <div className="bar" key={i}>
              <span className="label">{label}</span>
              <div className="track"><span className="fill" style={{width:`${(val/139)*100}%`}}/></div>
              <span className="num">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="row2">
        <div className="tt">포토&동영상</div>
        <div className="rail">
          {images.slice(0,6).map((src,i)=>(
            <div className="ph" key={i}><img src={src} alt={`pr-${i}`} /></div>
          ))}
        </div>
        {/* ✅ 포토&동영상 전체보기 버튼 추가 */}
        <button type="button" className="view-all">전체보기 &gt; </button>
      </div>
    </div>
  );
}

function ReviewItem({when="2025.03.14", user="WAY****", text, photos=[]}){
  return (
    <article className="rv-item">
      {/* 상단 줄: 별점/제목/날짜 */}
      <div className="rv-top">
        <div className="stars small">
          <span className="bg">★★★★★</span>
          <span className="fill" style={{width:"100%"}}>★★★★★</span>
        </div>
        <b className="tit">아주 좋아요</b>
        <time className="when">{when}</time>
      </div>

      {/* 본문: 왼쪽(텍스트/이미지) · 오른쪽(‘누구님의 리뷰입니다’+옵션) */}
      <div className="rv-main">
        <div className="left">
          <p className="text">{text}</p>
          {photos.length>0 && (
            <div className="photos">
              {photos.map((src,i)=><img key={i} src={src} alt={`rvp-${i}`} />)}
            </div>
          )}
          <div className="rv-actions">
            <button type="button">도움돼요 5</button>
            <button type="button">도움안돼요 0</button>
            <button type="button">댓글 0</button>
          </div>
        </div>

        <aside className="right">
          <div className="who">{user}님의 리뷰입니다.</div>
          <dl className="meta">
            <div><dt>사이즈</dt><dd>240</dd></div>
            <div><dt>발볼</dt><dd>보통</dd></div>
            <div><dt>색상</dt><dd>검-샤틴(154542)</dd></div>
          </dl>
        </aside>
      </div>
    </article>
  );
}

function ReviewsFull(){
  const IMGS = [g1,g2,g3,g4,g5,g6,g7,g8];
  const sampleTxt =
    "메리제인인것도 맘에 드는데 안에 쿠션이 내장되어 있어서 플랫슈즈 특유의 신고 걸을 때의 발 아픔과 피곤함이 없어서 좋았어요!!";

  return (
    <section id="review" className="rv-wrap">
      <div className="inner">
        <div className="rv-title">
          <h2>REVIEW <small>(156)</small></h2>
          <a href="#" className="more">전체 상품 리뷰 보기</a>
        </div>

        {/* 요약 카드 + 포토 썸네일 */}
        <ReviewSummary images={IMGS} />

        {/* ✅ 정렬/필터 바 추가 (UI만, 로직 미구현) */}
        <div className="rv-filters">
          <div className="left">
            <label className="visually-hidden" htmlFor="rv-sort">정렬</label>
            <select id="rv-sort" defaultValue="latest">
              <option value="latest">최신순</option>
              <option value="recommend">추천순</option>
              <option value="high">별점 높은순</option>
              <option value="low">별점 낮은순</option>
            </select>
            <label className="chk">
              <input type="checkbox" /> 포토·동영상 먼저 보기
            </label>
          </div>
          <input className="search" type="search" placeholder="리뷰 검색" />
        </div>

        {/* 리뷰 아이템 */}
        <div className="rv-list">
          <ReviewItem text={sampleTxt} photos={[IMGS[4],IMGS[2]]}/>
          <ReviewItem text={sampleTxt} photos={[IMGS[0],IMGS[3]]}/>
        </div>

        {/* ✅ 리뷰 숫자 페이지네이션 (리뷰 바로 아래) */}
        <div className="rv-num-pager">
          <button className="arrow">«</button>
          <button className="arrow">‹</button>
          {[1,2,3,4,5,6,7,8,9].map(n=>(
            <button key={n} className={`num ${n===1?"on":""}`}>{n}</button>
          ))}
          <button className="arrow">›</button>
          <button className="arrow">»</button>
        </div>
        <div className="q-actions">
            <button>WRITE A Q&amp;A</button>
            <button>LIST</button>
        </div>

        {/* ✅ 문의(Q&A) – 한 줄 레이아웃 + 하단 페이징 */}
        <section className="qna-board">
          <div className="q-title">Q&amp;A</div>

          <div className="q-row head">
            <div className="col subject">제목</div>
            <div className="col who">작성자</div>
            <div className="col when">작성일</div>
          </div>

          <div className="q-row">
            <div className="col subject">문의드립니다.</div>
            <div className="col who">김****</div>
            <div className="col when">2024-12-13 23:06:46</div>
          </div>

          <div className="q-pager">
            &laquo;&nbsp;&nbsp;1&nbsp;&nbsp;&raquo;
          </div>
        </section>
      </div>
    </section>
  );
}

/* ───────── 페이지 ───────── */
export default function ProductDetailCompact(){
  const GALLERY = [g1,g2,g3,g4,g5,g6,g7,g8];
  const DETAILS = [d1,d2,d3,d4,d5];

  const stickyStopRef = useRef(null);
  const rightColRef   = useRef(null);

  const { boxRef, style:rightStyle, spacerH } =
    useStickyWithinParent(stickyStopRef, rightColRef, 0, {
      stickFromStart:true, stopAtEnd:true, disableBelow:1024
    });

  return (
    <main className="product-detail-compact">
      {/* 상단 2열 */}
      <div className="container two-col" ref={stickyStopRef}>
        <div className="left-col">
          <GalleryCompact images={GALLERY} rating={4.8} reviewCount={166} />

          {/* 긴 상세 이미지들 */}
          <div className="poster">
            {DETAILS.map((src, i)=>(<img key={i} src={src} alt={`detail-${i}`} />))}
          </div>

          {/* 긴 이미지 바로 아래 가이드 */}
          <ReviewGuide />
        </div>

        <div className="right-col" ref={rightColRef}>
          <div style={{height:spacerH}} aria-hidden />
          <div ref={boxRef} style={rightStyle}>
            <CompactBuyBox />
          </div>
        </div>
      </div>

      {/* 리뷰: 가운데 정렬, 2열 아래 */}
      <div className="container">
        <ReviewsFull />
      </div>
    </main>
  );
}
