
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const cakes = [
  { id: "25909", type: "pasta", temp: "pasta", name: "Fiyonk Model Kırmızı Tasarım Pasta", people: "8 Kişilik", tl: 3200, pi: "10.1911 π", img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=90", desc: "Kırmızı fiyonk detaylı, özel günler için premium tasarım pasta.", rate: 4.9 },
  { id: "25912", type: "pasta", temp: "pasta", name: "Özel Gün Pastası", people: "4 Kişilik", tl: 1750, pi: "5.5732 π", img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=90", desc: "Doğum günü, yıl dönümü ve kutlamalar için şık özel pasta.", rate: 4.8 },
  { id: "25910", type: "pasta", temp: "pasta", name: "Lüks Moda Temalı Doğum Günü Pastası", people: "10 Kişilik", tl: 4000, pi: "12.7388 π", img: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=900&q=90", desc: "Moda temalı lüks doğum günü pastası, premium sunum.", rate: 5.0 },
];

const drinks = [
  { id: "D101", type: "drink", temp: "hot", name: "Türk Kahvesi", people: "Sıcak İçecek", tl: 95, pi: "0.3025 π", img: "https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?auto=format&fit=crop&w=900&q=90", desc: "Bol köpüklü geleneksel Türk kahvesi.", rate: 4.9 },
  { id: "D102", type: "drink", temp: "hot", name: "Latte", people: "Sıcak İçecek", tl: 135, pi: "0.4299 π", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=90", desc: "Yumuşak içimli sütlü espresso.", rate: 4.7 },
  { id: "D201", type: "drink", temp: "cold", name: "Ice Latte", people: "Soğuk İçecek", tl: 155, pi: "0.4936 π", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=90", desc: "Buzlu sütlü espresso ferahlığı.", rate: 4.8 },
  { id: "D202", type: "drink", temp: "cold", name: "Limonata", people: "Soğuk İçecek", tl: 110, pi: "0.3503 π", img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=90", desc: "Taze limonla ferahlatıcı içecek.", rate: 4.6 },
];

const foods = [
  { id: "F101", type: "food", temp: "breakfast", name: "Pi Anasayfa • Kahvaltı Tabağı", people: "Anasayfa • Kahvaltı", tl: 420, pi: "1.3375 π", img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=90", desc: "Peynir, zeytin, yumurta, reçel ve sıcak ekmek.", rate: 4.9 },
  { id: "F102", type: "food", temp: "breakfast", name: "Kruvasan Anasayfa • Kahvaltı", people: "Anasayfa • Kahvaltı", tl: 260, pi: "0.8280 π", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=90", desc: "Taze kruvasan, kahve ve mini atıştırmalık.", rate: 4.8 },
  { id: "F201", type: "food", temp: "food", name: "Gurme Cafe Burger", people: "Yemek", tl: 360, pi: "1.1465 π", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=90", desc: "Özel soslu gurme burger ve çıtır patates.", rate: 4.7 },
  { id: "F202", type: "food", temp: "food", name: "Tavuklu Wrap", people: "Yemek", tl: 280, pi: "0.8917 π", img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=90", desc: "Taze sebzeli tavuklu cafe wrap.", rate: 4.6 },
];

const products = [...cakes, ...drinks, ...foods];

const slides = [
  { title: "Aslan18.3 Premium Marketplace Cafe", text: "Yemek, kahvaltı, kampanya, sipariş takip ve Pi ödeme sistemi", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=90" },
  { title: "Anasayfa • Kahvaltı & Cafe Market", text: "Sıcak kahve, soğuk içecek, pasta ve yemek tek uygulamada", img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=90" },
  { title: "Canlı Sipariş Takip", text: "Hazırlanıyor, kuryede, teslim edildi demo akışı", img: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=90" },
];

export default function HomePage() {
  const [drawer, setDrawer] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [slide, setSlide] = useState(0);
  const [activePage, setActivePage] = useState("home");
  const [selected, setSelected] = useState<any>(null);
  const [pay, setPay] = useState<any>(null);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState(["Aslan16 marketplace seviyesi olmuş ❤️", "Anasayfa • Kahvaltı ve yemek menüsü efsane."]);
  const [commentText, setCommentText] = useState("");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [payHistory, setPayHistory] = useState<any[]>([]);
  const [dark, setDark] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponOk, setCouponOk] = useState(false);
  const [notify, setNotify] = useState("🎁 ASLAN16 aktif: PI16 kuponu ile demo %16 indirim!");
  const [music, setMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackingStep, setTrackingStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % slides.length), 3300);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTrackingStep((s) => (s + 1) % 4), 2600);
    return () => clearInterval(t);
  }, []);

  const menuItems = [
    { name: "Tüm Marketplace", page: "products" },
    { name: "Sıcak İçecekler", page: "hot" },
    { name: "Soğuk İçecekler", page: "cold" },
    { name: "Anasayfa • Kahvaltı", page: "breakfast" },
    { name: "Yemekler", page: "food" },
    { name: "Sipariş Takibi", page: "tracking" },
    { name: "Profil & VIP", page: "profile" },
    { name: "Pi Ödeme Geçmişi", page: "history" },
  ];


  useEffect(() => {
    const autoPlay = () => {
      if(audioRef.current){
        audioRef.current.volume = 0.75;
        audioRef.current.play().then(()=>setMusic(true)).catch(()=>{});
      }
    };

    setTimeout(autoPlay, 800);
    window.addEventListener("touchstart", autoPlay, { once:true });
    window.addEventListener("click", autoPlay, { once:true });

    return () => {
      window.removeEventListener("touchstart", autoPlay);
      window.removeEventListener("click", autoPlay);
    };
  }, []);

  const toggleMusic = () => {
    if(!audioRef.current) return;

    if(music){
      audioRef.current.pause();
      setMusic(false);
    } else {
      audioRef.current.play();
      setMusic(true);
    }
  };


  const openPage = (page: string) => {
    setActivePage(page);
    setDrawer(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addCart = (item: any) => {
    setCart((old) => [...old, item]);
    setNotify("🛒 " + item.name + " sepete eklendi.");
  };

  const confirmPayment = () => {
    if (pay) {
      setPayHistory((old) => [{ name: pay.name, pi: pay.pi, date: new Date().toLocaleString("tr-TR") }, ...old]);
      setNotify("✅ Demo Pi ödeme başarılı: " + pay.name);
    }
    setPay(null);
  };

  const totalTlRaw = cart.reduce((s, i) => s + i.tl, 0);
  const discount = couponOk ? Math.round(totalTlRaw * 0.16) : 0;
  const totalTl = Math.max(0, totalTlRaw - discount);
  const totalPi = (totalTl / 314).toFixed(4);

  const visibleProducts = useMemo(() => {
    let list = products;
    if (activePage === "hot") list = products.filter((p) => p.temp === "hot");
    if (activePage === "cold") list = products.filter((p) => p.temp === "cold");
    if (activePage === "breakfast") list = products.filter((p) => p.temp === "breakfast");
    if (activePage === "food") list = products.filter((p) => p.temp === "food");
    if (activePage === "products" || activePage === "home") {
      if (category === "hot") list = products.filter((p) => p.temp === "hot");
      if (category === "cold") list = products.filter((p) => p.temp === "cold");
      if (category === "pasta") list = products.filter((p) => p.type === "pasta");
      if (category === "breakfast") list = products.filter((p) => p.temp === "breakfast");
      if (category === "food") list = products.filter((p) => p.temp === "food");
    }
    if (search.trim()) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [activePage, category, search]);

  const trackingLabels = ["Alındı", "Hazırlanıyor", "Kuryede", "Teslim Edildi"];

  return (
    <div className={dark ? "page dark" : "page"}>
      <audio ref={audioRef} loop preload="auto">
        <source src="/cafe.mp3" type="audio/mpeg"/>
      </audio>
      <div className="loading">ASLAN18.3</div>

      {notify && <div className="notify" onClick={() => setNotify("")}>{notify}</div>}

      <header className="header">
        <div className="logoWrap" onClick={() => openPage("home")}>
          <div className="aslan183RealCoin" aria-label="ASLAN18.3 5K HD gerçek Pi Coin">
          <img src="/aslan18_3_hd_real_pi_coin.webp" alt="5K HD gerçek Pi Coin" />
        </div>
          <div>
            <h1>Piikizler</h1>
            <p>ASLAN18.3 • 18.2 üstüne 5K HD Pi Coin</p>
          </div>
        </div>
        <button className="cartBtn" onClick={() => openPage("cart")}>🛒<span>{cart.length}</span></button>
      </header>

      <div className="redbar">
        <b>Premium Marketplace</b>
        <button onClick={() => setDrawer(!drawer)}>{drawer ? "×" : "☰"}</button>
      </div>

      {drawer && (
        <nav className="drawer">
          {menuItems.map((item) => (
            <button key={item.page} onClick={() => openPage(item.page)}>{item.name} <span>›</span></button>
          ))}
        </nav>
      )}

      {activePage === "home" && (
        <>
          <section className="slider" style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.10),rgba(0,0,0,.75)),url(${slides[slide].img})` }}>
            <div>
              <small>ASLAN18.3 MARKETPLACE</small>
              <h2>{slides[slide].title}</h2>
              <p>{slides[slide].text}</p>
              <button onClick={() => openPage("products")}>Marketplace Aç</button>
              <button className="goldBtn" onClick={() => setPay({ name: "Aslan16 Demo Pi Ödeme", pi: "0.25 π", tl: 78.5 })}>Pay with Pi</button>
            </div>
            <div className="dots">{slides.map((_, i) => <button key={i} className={i === slide ? "active" : ""} onClick={() => setSlide(i)} />)}</div>
          </section>

          <div className="controlPanel">
            <button onClick={() => setDark(!dark)}>{dark ? "☀️ Gündüz" : "🌙 Gece"}</button>
            <button onClick={toggleMusic}>{music ? "🔇 Müzik Kapat" : "🎵 Cafe Müziği"}</button>
            <button onClick={() => openPage("tracking")}>🛵 Takip</button>
          </div>

          <div className="couponBox">
            <b>🎁 Kampanya Kuponu</b>
            <p>PI16 yaz, demo %16 indirim aktif olsun.</p>
            <div>
              <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Kupon kodu" />
              <button onClick={() => { const ok = coupon.toUpperCase() === "PI16"; setCouponOk(ok); setNotify(ok ? "🎁 PI16 kuponu aktif!" : "Kupon bulunamadı."); }}>Uygula</button>
            </div>
          </div>

          <SearchAndTabs search={search} setSearch={setSearch} category={category} setCategory={setCategory} />
          <Title text="Aslan16 Marketplace Menü" />
          <ProductGrid items={visibleProducts.slice(0, 9)} addCart={addCart} setSelected={setSelected} setPay={setPay} liked={liked} setLiked={setLiked} />
        </>
      )}

      {(activePage === "products" || activePage === "hot" || activePage === "cold" || activePage === "breakfast" || activePage === "food") && (
        <>
          <SearchAndTabs search={search} setSearch={setSearch} category={category} setCategory={setCategory} />
          <Title text={activePage === "hot" ? "Sıcak İçecekler" : activePage === "cold" ? "Soğuk İçecekler" : activePage === "breakfast" ? "Anasayfa • Kahvaltı" : activePage === "food" ? "Yemekler" : "Tüm Marketplace"} />
          <ProductGrid items={visibleProducts} addCart={addCart} setSelected={setSelected} setPay={setPay} liked={liked} setLiked={setLiked} />
        </>
      )}

      {activePage === "tracking" && (
        <section className="panel center">
          <div className="infoIcon">🛵</div>
          <h2>Canlı Sipariş Takibi</h2>
          <p>Demo sipariş: PI-{cart.length + 1600}</p>
          <div className="track">
            {trackingLabels.map((t, i) => <div key={t} className={i <= trackingStep ? "on" : ""}><span>{i + 1}</span><b>{t}</b></div>)}
          </div>
          <div className="courier">🛵💨</div>
        </section>
      )}

      {activePage === "profile" && (
        <section className="panel center">
          <div className="infoIcon">👑</div>
          <h2>VIP Pi Profil</h2>
          <p>Talha • Premium Marketplace Üyesi</p>
          <div className="statGrid">
            <div><b>314π</b><span>Bakiye</span></div>
            <div><b>{cart.length}</b><span>Sepet</span></div>
            <div><b>{Object.values(liked).filter(Boolean).length}</b><span>Favori</span></div>
          </div>
          <button className="mainBtn" onClick={() => openPage("history")}>Pi Ödeme Geçmişi</button>
        </section>
      )}

      {activePage === "history" && (
        <section className="panel">
          <h2>Pi Ödeme Geçmişi</h2>
          {payHistory.length === 0 ? <p>Henüz demo ödeme yok.</p> : payHistory.map((h, i) => <div className="cartLine" key={i}><span>{h.name}<small>{h.date}</small></span><b>{h.pi}</b></div>)}
        </section>
      )}

      {activePage === "cart" && (
        <section className="panel">
          <h2>Sepetim</h2>
          {cart.length === 0 ? <p>Sepet şu an boş.</p> : cart.map((i, idx) => <div className="cartLine" key={idx}><span>{i.name}</span><b>{i.pi}</b></div>)}
          {couponOk && <p className="discount">PI16 indirimi: -{discount} TL</p>}
          <h3>Toplam: {totalTl} TL</h3>
          <h3>Pi karşılığı: {totalPi} π</h3>
          <button className="mainBtn" onClick={() => setPay({ name: "Sepet Ödemesi", pi: totalPi + " π", tl: totalTl })}>Pi ile Öde</button>
        </section>
      )}

      {activePage === "comments" && (
        <section className="panel">
          <h2>Yorumlar</h2>
          {comments.map((c, i) => <p className="comment" key={i}>{c}</p>)}
          <div className="commentForm">
            <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Yorum yaz..." />
            <button onClick={() => { if (commentText.trim()) { setComments([commentText, ...comments]); setCommentText(""); }}}>Ekle</button>
          </div>
        </section>
      )}

      <div className="bottomActions">
        <button onClick={() => openPage("breakfast")}>🥐 Anasayfa • Kahvaltı</button>
        <button onClick={() => openPage("food")}>🍔 Yemek</button>
        <button onClick={() => openPage("tracking")}>🛵 Takip</button>
      </div>

      {selected && (
        <div className="modal">
          <div className="modalBox">
            <button className="close" onClick={() => setSelected(null)}>×</button>
            <img src={selected.img} />
            <h2>{selected.name}</h2>
            <p>{selected.desc}</p>
            <h3>{selected.pi}</h3>
            <div className="rating">⭐ {selected.rate} / 5.0</div>
            <button className="mainBtn" onClick={() => { addCart(selected); setSelected(null); }}>Sepete Ekle</button>
            <button className="goldBtn full" onClick={() => { setPay(selected); setSelected(null); }}>Pay with Pi</button>
          </div>
        </div>
      )}

      {pay && (
        <div className="modal">
          <div className="modalBox payBox">
            <button className="close" onClick={() => setPay(null)}>×</button>
            <div className="bigPi">π</div>
            <h2>Pi Wallet</h2>
            <p>{pay.name}</p>
            <h3>{pay.pi}</h3>
            <small>Demo bakiye: 314 π</small>
            <button className="goldBtn full" onClick={confirmPayment}>Confirm Demo Payment</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchAndTabs({ search, setSearch, category, setCategory }: any) {
  return (
    <section className="searchArea">
      <div className="search">🔍 <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Kahve, pasta, burger, kahvaltı ara..." /></div>
      <div className="tabs">
        <button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>Tümü</button>
        <button className={category === "hot" ? "active" : ""} onClick={() => setCategory("hot")}>☕ Sıcak</button>
        <button className={category === "cold" ? "active" : ""} onClick={() => setCategory("cold")}>🧊 Soğuk</button>
        <button className={category === "pasta" ? "active" : ""} onClick={() => setCategory("pasta")}>🍰 Pasta</button>
        <button className={category === "breakfast" ? "active" : ""} onClick={() => setCategory("breakfast")}>🥐 Anasayfa • Kahvaltı</button>
        <button className={category === "food" ? "active" : ""} onClick={() => setCategory("food")}>🍔 Yemek</button>
      </div>
    </section>
  );
}

function Title({ text }: { text: string }) { return <h2 className="sectionTitle">{text}</h2>; }

function ProductGrid({ items, addCart, setSelected, setPay, liked, setLiked }: any) {
  return (
    <section className="grid">
      {items.map((item: any) => (
        <article className="card" key={item.id}>
          <img src={item.img} onClick={() => setSelected(item)} />
          <div className="cardBody">
            <small>{item.people} • Kod: {item.id}</small>
            <h3 onClick={() => setSelected(item)}>{item.name}</h3>
            <p>{item.desc}</p>
            <div className="ratingSmall">⭐ {item.rate}</div>
            <div className="priceRow"><b>{item.tl} TL</b><strong>{item.pi}</strong></div>
            <div className="cardBtns">
              <button onClick={() => setLiked({ ...liked, [item.id]: !liked[item.id] })}>{liked[item.id] ? "❤️" : "🤍"}</button>
              <button onClick={() => addCart(item)}>Sepet</button>
              <button onClick={() => setPay(item)}>Pi Öde</button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
