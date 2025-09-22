// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Header2 from "./components/Header2";
import HeroSlider from "./components/HeroSlider"; // 슬라이더 바로 불러오기
import HeroSlider1 from "./components/HeroSlider1";
import Section01 from "./components/Section01";


import ProductGrid from "./components/ProductGrid";
import CollectionGrid from "./components/CollectionGrid";









const SLIDES = [
  { title: "Summer Knit",   img: "/images/kv1.jpg", link: "/shop/knit" },
  { title: "Soft Cardigan", img: "/images/kv2.jpg", link: "/shop/cardigan" },
  { title: "Daily Cotton",  img: "/images/kv3.jpg", link: "/shop/cotton" },
];

export default function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}       {/* 헤더 버전 1 */}
      {/* <Header2 /> */}  {/* 헤더 버전 2 */}
      <Routes>
       <Route path="/" element={<HeroSlider />} /> {/* 슬라이더 버전1 */}

       {/* <Route path="/" element={<ProductGrid />} /> */}  {/* 리스트 버전2 */}
       {/* <Route path="/" element={<CollectionGrid />} /> */} {/* 리스트 버전 1 */}
       <Route
          path="/"
          element={
            <HeroSlider1
              slides={SLIDES}
              interval={6000}
              pauseOnHover={true}
              flipDuration={2400}
            />        
          }
        />     {/* 슬라이더 2  */}
      </Routes>
      {/* <Section01 /> */} {/* 슬라이더 버전3 */}
      
    </BrowserRouter>
  );
}
     