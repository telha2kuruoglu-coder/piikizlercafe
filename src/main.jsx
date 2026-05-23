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
  { name: 'Zeynep', text: 'Pi ödeme artık TestPi sistemine bağlanıyor.', hearts: 144 }
]

function App() {
  const [musicOn, setMusicOn] = useState(false)
  const [cart, setCart] = useState([])
  const [paymentStatus, setPaymentStatus] = useState('TestPi ödeme hazır')
  const [piReady, setPiReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPiReady(Boolean(window.Pi))
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const allItems = [...drinksHot, ...drinksCold, ...desserts]

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price, 0)
  }, [cart])

  const addToCart = (item) => {
    setCart((prev) => [...prev, item])
    setPaymentStatus(`${item.name} sepete eklendi`)
  }

  const clearCart = () => {
    setCart([])
    setPaymentStatus('Sepet temizlendi')
  }

  const onIncompletePaymentFound = (payment) => {
    console.log('Eksik ödeme bulundu:', payment)
    setPaymentStatus('Eksik ödeme bulundu, tekrar kontrol ediliyor...')
  }

  const handlePiPayment = async () => {
    try {
      if (!window.Pi) {
        setPaymentStatus('Pi SDK bulunamadı')
        alert('Pi SDK bulunamadı. Lütfen Pi Browser veya Pi uzantı/domain adresinden aç.')
        return
      }

      if (cart.length === 0) {
        alert('Ödeme için önce sepete ürün ekle.')
        return
      }

      const amount = Number(total.toFixed(2))

      if (!amount || amount <= 0) {
        alert('Geçerli ödeme tutarı oluşmadı.')
        return
      }

      setPaymentStatus('Pi hesabı doğrulanıyor...')

      await window.Pi.authenticate(['payments'], onIncompletePaymentFound)

      setPaymentStatus('TestPi ödeme başlatılıyor...')

      const paymentData = {
        amount,
        memo: 'Pi İkizler Cafe ASLAN 18.7 TestPi Siparişi',
        metadata: {
          app: 'Pi İkizler Cafe',
          version: 'ASLAN 18.7',
          source: window.location.hostname,
          items: cart.map((item) => item.name),
          total: amount
        }
      }

      window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: async function (paymentId) {
          setPaymentStatus('Ödeme server onayına gönderiliyor...')

          const response = await fetch('/api/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId })
          })

          const data = await response.json().catch(() => ({}))

          if (!response.ok) {
            console.error('Approve hatası:', data)
            throw new Error('Approve başarısız')
          }

          setPaymentStatus('Server onayı tamamlandı')
        },

        onReadyForServerCompletion: async function (paymentId, txid) {
          setPaymentStatus('Ödeme blockchain tamamlamasına gönderiliyor...')

          const response = await fetch('/api/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, txid })
          })

          const data = await response.json().catch(() => ({}))

          if (!response.ok) {
            console.error('Complete hatası:', data)
            throw new Error('Complete başarısız')
          }

          setPaymentStatus('✅ TestPi ödeme başarılı')
          alert('✅ TestPi ödeme başarılı')
          setCart([])
        },

        onCancel: function (paymentId) {
          console.log('Ödeme iptal edildi:', paymentId)
          setPaymentStatus('Ödeme iptal edildi')
        },

        onError: function (error, payment) {
          console.error('Pi ödeme hatası:', error, payment)
          setPaymentStatus('Pi ödeme hatası oluştu')
          alert('Pi ödeme hatası: ' + (error?.message || 'Bilinmeyen hata'))
        }
      })
    } catch (error) {
      console.error('Ödeme başlatılamadı:', error)
      setPaymentStatus('Ödeme başlatılamadı')
      alert(error.message || 'Ödeme başlatılamadı')
    }
  }

  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="badge">ASLAN 18.7 • TestPi Payment Fix</p>
          <h1>☕ Pi İkizler Cafe</h1>
          <p>
            Hem uygulama içi hem de uzantı/domain adresinde çalışan TestPi ödeme sistemi.
          </p>

          <div className="heroActions">
            <button type="button" onClick={() => setMusicOn((v) => !v)}>
              {musicOn ? '🔊 Müzik Açık' : '🔇 Müzik Kapalı'}
            </button>

            <button type="button" onClick={handlePiPayment}>
              Pay with Pi / TestPi ile Öde
            </button>
          </div>

          <p className="status">{paymentStatus}</p>
          <p className="mini">
            Pi SDK: {piReady ? 'Hazır ✅' : 'Bekleniyor / Pi Browser gerekli'}
          </p>
        </div>

        <div className="piCoin">π</div>
      </section>

      <section className="panel">
        <h2>🛒 Sepet</h2>

        {cart.length === 0 ? (
          <p>Sepet boş. Ürün ekle, sonra TestPi ile öde.</p>
        ) : (
          <>
            {cart.map((item, index) => (
              <div className="cartRow" key={`${item.name}-${index}`}>
                <span>{item.icon} {item.name}</span>
                <b>{item.price.toFixed(2)} Pi</b>
              </div>
            ))}

            <div className="total">
              <span>Toplam</span>
              <strong>{total.toFixed(2)} Pi</strong>
            </div>

            <button type="button" className="payBtn" onClick={handlePiPayment}>
              Pay with Pi / TestPi ile Öde
            </button>

            <button type="button" className="clearBtn" onClick={clearCart}>
              Sepeti Temizle
            </button>
          </>
        )}
      </section>

      <Menu title="🔥 Sıcak İçecekler" items={drinksHot} addToCart={addToCart} />
      <Menu title="🧊 Soğuk İçecekler" items={drinksCold} addToCart={addToCart} />
      <Menu title="🍰 Tatlılar" items={desserts} addToCart={addToCart} />

      <section className="panel">
        <h2>⭐ Öne Çıkanlar</h2>

        <div className="featureGrid">
          <div>
            <b>Uygulama İçi Ödeme</b>
            <span>Pi Browser içinde TestPi akışı</span>
          </div>

          <div>
            <b>Uzantı/Domain Ödeme</b>
            <span>apppiikizlercafe4649.pinet.com desteği</span>
          </div>

          <div>
            <b>Server Callback</b>
            <span>/api/approve ve /api/complete</span>
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

      <section className="panel">
        <h2>🧪 Test Notu</h2>
        <p>
          Bu sürüm ASLAN 18.6 üstüne ödeme düzeltmesi olarak hazırlanmıştır.
          Hedef sürüm: <b>ASLAN 18.7</b>.
        </p>
        <p>
          Ödeme zinciri: <b>window.Pi.createPayment → /api/approve → /api/complete</b>
        </p>
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
