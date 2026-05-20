import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

const drinksHot = [
  { name: 'Türk Kahvesi', price: 0.05, icon: '☕', note: 'Köz tadında klasik' },
  { name: 'Latte', price: 0.07, icon: '🥛', note: 'Yumuşak içim' },
  { name: 'Cappuccino', price: 0.08, icon: '☕', note: 'Bol köpüklü' },
  { name: 'Mocha', price: 0.09, icon: '🍫', note: 'Çikolatalı özel' },
  { name: 'Sıcak Çikolata', price: 0.10, icon: '🍫', note: 'Yoğun aroma' }
]

const drinksCold = [
  { name: 'Ice Latte', price: 0.08, icon: '🧊', note: 'Soğuk kahve' },
  { name: 'Limonata', price: 0.06, icon: '🍋', note: 'Ferah ev yapımı' },
  { name: 'Frozen', price: 0.10, icon: '❄️', note: 'Buzlu meyve' },
  { name: 'Milkshake', price: 0.11, icon: '🥤', note: 'Kremalı lezzet' },
  { name: 'Cold Brew', price: 0.12, icon: '🧋', note: 'Modern kahve' }
]

const desserts = [
  { name: 'Pi Pasta', price: 0.14, icon: '🥧', note: 'İmza tatlı' },
  { name: 'San Sebastian', price: 0.13, icon: '🍰', note: 'Kremamsı' },
  { name: 'Cheesecake', price: 0.12, icon: '🍓', note: 'Orman meyveli' },
  { name: 'Profiterol', price: 0.10, icon: '🍫', note: 'Çikolata soslu' },
  { name: 'Tiramisu', price: 0.11, icon: '🍮', note: 'Kahveli tatlı' }
]

const comments = [
  { name: 'Ayşe', text: 'Pi Pasta ve latte harika olmuş.', hearts: 128 },
  { name: 'Mehmet', text: 'Mor tema çok premium duruyor.', hearts: 96 },
  { name: 'Zeynep', text: 'Pi ödeme demo alanı çok iyi.', hearts: 144 }
]

function App() {
  const [musicOn, setMusicOn] = useState(false)
  const [cart, setCart] = useState([])
  const [likes, setLikes] = useState(314)
  const [piReady, setPiReady] = useState(false)

  const totalPi = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart])

  useEffect(() => {
    const checkPi = setInterval(() => {
      if (window.Pi) {
        window.Pi.init({
          version: '2.0',
          sandbox: true
        })
        setPiReady(true)
        clearInterval(checkPi)
      }
    }, 500)

    return () => clearInterval(checkPi)
  }, [])

  function addToCart(item) {
    setCart((old) => [...old, item])
  }

  async function startPiPayment() {
    alert('Buton çalıştı. Pi ödeme başlatılıyor.')

    if (!window.Pi) {
      alert('Pi SDK bulunamadı. Pi Browser içinden aç.')
      return
    }

    try {
      window.Pi.init({
        version: '2.0',
        sandbox: true
      })

      await window.Pi.authenticate(['payments'], function (payment) {
        console.log('Incomplete payment:', payment)
      })

      window.Pi.createPayment(
        {
          amount: 0.01,
          memo: 'Piikizler Cafe Test Odeme',
          metadata: { type: 'test-payment' }
        },
        {
          onReadyForServerApproval: function (paymentId) {
            alert('Odeme onay bekliyor: ' + paymentId)
          },
          onReadyForServerCompletion: function (paymentId, txid) {
            alert('Odeme tamamlandi: ' + txid)
          },
          onCancel: function () {
            alert('Odeme iptal edildi')
          },
          onError: function (error) {
            alert('Hata: ' + JSON.stringify(error))
          }
        }
      )
    } catch (err) {
      alert('Pi giris/odeme hatasi: ' + err.message)
    }
  }

  return (
    <main className="app">
      <section className="hero">
        <div className="topline">
          <span>ASLAN 18.1</span>
          <span>{piReady ? 'Pi SDK Hazır' : 'Pi SDK Bekleniyor'}</span>
        </div>

        <div className="coin">π</div>
        <h1>Piikizler Cafe</h1>

        <p>Aslan 18 büyük yükseltme: admin panel görünümü, slider, yorum/kalp, kampanya vitrini ve dolu menü.</p>

        <div className="heroActions">
          <button className="goldBtn" type="button" onClick={() => setMusicOn(!musicOn)}>
            {musicOn ? '🎵 Slow Cafe Müzik Açık' : '🎵 Müziği Aç'}
          </button>

          <button className="darkBtn" type="button" onClick={() => setLikes(likes + 1)}>
            ❤️ {likes}
          </button>
        </div>

        <div className="musicBox">
          {musicOn ? 'Modern slow cafe modu aktif.' : 'Telefonlarda otomatik müzik engellenebilir; butonla başlatılır.'}
        </div>
      </section>

      <section className="slider">
        <div className="slide mainSlide">
          <b>☕ Premium Cafe</b>
          <span>Pi ile modern sipariş deneyimi</span>
        </div>
        <div className="slide">
          <b>🍰 Tatlı Vitrini</b>
          <span>Günlük taze ürünler</span>
        </div>
        <div className="slide">
          <b>🪙 Demo Pi Ödeme</b>
          <span>Testnet ödeme alanı</span>
        </div>
      </section>

      <section className="stats">
        <div><b>{cart.length}</b><span>Sepet</span></div>
        <div><b>{totalPi.toFixed(2)} Pi</b><span>Toplam</span></div>
        <div><b>314$</b><span>Pi vitrin</span></div>
      </section>

      <section className="campaign">
        <h2>🔥 Günün Kampanyası</h2>
        <p>Latte + Pi Pasta menüsü: VIP müşterilere özel demo indirim alanı.</p>
        <button type="button" onClick={() => addToCart({ name: 'VIP Menü', price: 0.18, icon: '👑', note: 'Kampanya' })}>
          Sepete Ekle
        </button>
      </section>

      <Menu title="🔥 Sıcak İçecekler" items={drinksHot} addToCart={addToCart} />
      <Menu title="❄️ Soğuk İçecekler" items={drinksCold} addToCart={addToCart} />
      <Menu title="🍰 Tatlılar" items={desserts} addToCart={addToCart} />

      <section className="panel">
        <h2>🪙 Demo Pi Ödeme</h2>
        <p>Sepette {cart.length} ürün var. Toplam: {totalPi.toFixed(2)} Pi</p>

        <button
          type="button"
          className="payBtn"
          style={{
            position: 'relative',
            zIndex: 999999,
            pointerEvents: 'auto',
            touchAction: 'manipulation'
          }}
          onClick={startPiPayment}
        >
          Pi ile Demo Öde
        </button>
      </section>

      <section className="admin">
        <h2>⚙️ Admin Panel</h2>
        <div className="adminGrid">
          <div><b>Ürün Ekle</b><span>Menüye yeni ürün</span></div>
          <div><b>Slider Yönet</b><span>Ana sayfa görseli</span></div>
          <div><b>Kampanya</b><span>VIP Pi menüsü</span></div>
          <div><b>Yorumlar</b><span>Kalp ve beğeni</span></div>
        </div>
      </section>

      <section className="panel">
        <h2>💬 Müşteri Yorumları</h2>
        {comments.map((c) => (
          <div className="comment" key={c.name}>
            <strong>{c.name}</strong>
            <p>{c.text}</p>
            <span>❤️ {c.hearts}</span>
          </div>
        ))}
      </section>
    </main>
  )
}

function Menu({ title, items, addToCart }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {items.map((item) => (
        <div className="item" key={item.name}>
          <div className="foodIcon">{item.icon}</div>
          <div>
            <strong>{item.name}</strong>
            <span>{item.note} • {item.price.toFixed(2)} Pi</span>
          </div>
          <button type="button" onClick={() => addToCart(item)}>+</button>
        </div>
      ))}
    </section>
  )
}

createRoot(document.getElementById('root')).render(<App />)
