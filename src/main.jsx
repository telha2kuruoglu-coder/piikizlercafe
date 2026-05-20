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
  const [user, setUser] = useState(null)
  const [paying, setPaying] = useState(false)

  const totalPi = useMemo(
    () => cart.reduce((sum, item) => sum + item.price, 0),
    [cart]
  )

  useEffect(() => {
    const timer = setInterval(() => {
      if (window.Pi) {
        try {
          window.Pi.init({
            version: '2.0',
            sandbox: true
          })
          setPiReady(true)
          clearInterval(timer)
        } catch (e) {
          console.log('Pi init bekleniyor:', e)
        }
      }
    }, 500)

    return () => clearInterval(timer)
  }, [])

  function addToCart(item) {
    setCart((old) => [...old, item])
  }

  async function safePost(url, data) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        console.log(url + ' cevap vermedi:', res.status)
      }

      return true
    } catch (err) {
      console.log(url + ' api yok veya hata verdi:', err)
      return false
    }
  }

  async function startPiPayment() {
    if (paying) return

    if (!window.Pi) {
      alert('Pi SDK bulunamadı. Uygulamayı Pi Browser içinden aç.')
      return
    }

    setPaying(true)

    try {
      window.Pi.init({
        version: '2.0',
        sandbox: true
      })

      const authResult = await window.Pi.authenticate(
        ['username', 'payments'],
        function (payment) {
          console.log('Tamamlanmamış ödeme:', payment)
        }
      )

      setUser(authResult.user)

      const paymentAmount = totalPi > 0 ? Number(totalPi.toFixed(2)) : 0.01

      await window.Pi.createPayment(
        {
          amount: paymentAmount,
          memo: 'Piikizler Cafe Demo Odeme',
          metadata: {
            app: 'Piikizler Cafe',
            type: 'demo-payment',
            username: authResult?.user?.username || 'guest',
            cartCount: cart.length,
            total: paymentAmount
          }
        },
        {
          onReadyForServerApproval: async function (paymentId) {
            console.log('Server approval:', paymentId)

            await safePost('/api/approve-payment', {
              paymentId
            })
          },

          onReadyForServerCompletion: async function (paymentId, txid) {
            console.log('Server completion:', paymentId, txid)

            await safePost('/api/complete-payment', {
              paymentId,
              txid
            })

            alert('Ödeme başarıyla tamamlandı ✅')
            setCart([])
            setPaying(false)
          },

          onCancel: function (paymentId) {
            console.log('Ödeme iptal edildi:', paymentId)
            alert('Ödeme iptal edildi. Tekrar denemek için Pi ile Demo Öde butonuna bas.')
            setPaying(false)
          },

          onError: function (error, payment) {
            console.log('Pi ödeme hatası:', error, payment)
            alert('Pi ödeme hatası: ' + JSON.stringify(error))
            setPaying(false)
          }
        }
      )
    } catch (err) {
      console.log('Pi giriş/ödeme hatası:', err)
      alert('Pi giriş/ödeme hatası: ' + (err?.message || JSON.stringify(err)))
      setPaying(false)
    }
  }

  return (
    <main className="app">
      <section className="hero">
        <div className="topline">
          <span>ASLAN 18.2</span>
          <span>{piReady ? 'Pi SDK Hazır' : 'Pi SDK Bekleniyor'}</span>
        </div>

        <div className="coin">π</div>
        <h1>Piikizler Cafe</h1>

        <p>
          Piikizler Cafe premium Pi ödeme demo sistemi, sıcak/soğuk içecekler,
          tatlı vitrini, kampanya alanı ve Pi Browser uyumlu ödeme testi.
        </p>

        {user && (
          <div className="musicBox">
            Hoş geldin @{user.username}
          </div>
        )}

        <div className="heroActions">
          <button
            className="goldBtn"
            type="button"
            onClick={() => setMusicOn(!musicOn)}
          >
            {musicOn ? '🎵 Slow Cafe Müzik Açık' : '🎵 Müziği Aç'}
          </button>

          <button
            className="darkBtn"
            type="button"
            onClick={() => setLikes(likes + 1)}
          >
            ❤️ {likes}
          </button>
        </div>

        <div className="musicBox">
          {musicOn
            ? 'Modern slow cafe modu aktif.'
            : 'Telefonlarda otomatik müzik engellenebilir; butonla başlatılır.'}
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
          <b>🪙 Pi Demo Ödeme</b>
          <span>Sandbox ödeme test alanı</span>
        </div>
      </section>

      <section className="stats">
        <div>
          <b>{cart.length}</b>
          <span>Sepet</span>
        </div>

        <div>
          <b>{totalPi.toFixed(2)} Pi</b>
          <span>Toplam</span>
        </div>

        <div>
          <b>314$</b>
          <span>Pi vitrin</span>
        </div>
      </section>

      <section className="campaign">
        <h2>🔥 Günün Kampanyası</h2>
        <p>Latte + Pi Pasta menüsü: VIP müşterilere özel demo indirim alanı.</p>

        <button
          type="button"
          onClick={() =>
            addToCart({
              name: 'VIP Menü',
              price: 0.18,
              icon: '👑',
              note: 'Kampanya'
            })
          }
        >
          Sepete Ekle
        </button>
      </section>

      <Menu title="🔥 Sıcak İçecekler" items={drinksHot} addToCart={addToCart} />
      <Menu title="❄️ Soğuk İçecekler" items={drinksCold} addToCart={addToCart} />
      <Menu title="🍰 Tatlılar" items={desserts} addToCart={addToCart} />

      <section className="panel">
        <h2>🪙 Pi Demo Ödeme</h2>
        <p>Sepette {cart.length} ürün var. Toplam: {totalPi.toFixed(2)} Pi</p>
        <p>Test için ürün yoksa otomatik 0.01 Pi demo ödeme açılır.</p>

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
          disabled={paying}
        >
          {paying ? 'Pi Ödeme Açılıyor...' : 'Pi ile Demo Öde'}
        </button>
      </section>

      <section className="admin">
        <h2>⚙️ Admin Panel</h2>

        <div className="adminGrid">
          <div>
            <b>Ürün Ekle</b>
            <span>Menüye yeni ürün</span>
          </div>

          <div>
            <b>Slider Yönet</b>
            <span>Ana sayfa görseli</span>
          </div>

          <div>
            <b>Kampanya</b>
            <span>VIP Pi menüsü</span>
          </div>

          <div>
            <b>Yorumlar</b>
            <span>Kalp ve beğeni</span>
          </div>
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

          <button type="button" onClick={() => addToCart(item)}>
            +
          </button>
        </div>
      ))}
    </section>
  )
}

createRoot(document.getElementById('root')).render(<App />)
