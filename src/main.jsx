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

function App() {
  const [cart, setCart] = useState([])
  const [paymentStatus, setPaymentStatus] = useState('TestPi ödeme hazır')
  const [piReady, setPiReady] = useState(false)

  useEffect(() => {
    const initPi = () => {
      try {
        if (window.Pi && !window.__PI_APP_INIT__) {
          window.Pi.init({
            version: '2.0',
            sandbox: true
          })

          window.__PI_APP_INIT__ = true
          setPiReady(true)
          setPaymentStatus('Pi SDK hazır')
        } else if (window.Pi) {
          setPiReady(true)
        }
      } catch (err) {
        console.log(err)
      }
    }

    initPi()

    const timer = setInterval(() => {
      initPi()
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price, 0)
  }, [cart])

  const addToCart = (item) => {
    setCart((prev) => [...prev, item])
    setPaymentStatus(item.name + ' sepete eklendi')
  }

  const clearCart = () => {
    setCart([])
    setPaymentStatus('Sepet temizlendi')
  }

  const onIncompletePaymentFound = (payment) => {
    console.log(payment)
  }

  const handlePiPayment = async () => {
    try {
      if (!window.Pi) {
        alert('Pi Browser veya Pi domain adresinden aç.')
        return
      }

      if (cart.length === 0) {
        alert('Önce sepete ürün ekle.')
        return
      }

      const amount = Number(total.toFixed(2))

      await window.Pi.authenticate(['payments'], onIncompletePaymentFound)

      setPaymentStatus('TestPi ödeme başlatılıyor...')

      const paymentData = {
        amount: amount,
        memo: 'Pi İkizler Cafe ASLAN 18.7',
        metadata: {
          items: cart.map((i) => i.name),
          source: window.location.hostname
        }
      }

      window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: async function(paymentId) {

          setPaymentStatus('Approve gönderiliyor...')

          const response = await fetch('/api/approve', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              paymentId
            })
          })

          if (!response.ok) {
            throw new Error('Approve başarısız')
          }

          setPaymentStatus('Approve tamamlandı')
        },

        onReadyForServerCompletion: async function(paymentId, txid) {

          setPaymentStatus('Complete gönderiliyor...')

          const response = await fetch('/api/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              paymentId,
              txid
            })
          })

          if (!response.ok) {
            throw new Error('Complete başarısız')
          }

          setPaymentStatus('✅ TestPi ödeme başarılı')
          alert('✅ TestPi ödeme başarılı')

          setCart([])
        },

        onCancel: function() {
          setPaymentStatus('Ödeme iptal edildi')
        },

        onError: function(error) {
          console.log(error)
          setPaymentStatus('Pi ödeme hatası')
          alert('Pi ödeme hatası oluştu')
        }
      })

    } catch (error) {
      console.log(error)
      setPaymentStatus('Ödeme başlatılamadı')
      alert(error.message)
    }
  }

  return (
    <main className="app">

      <section className="hero">
        <div>

          <p className="badge">
            ASLAN 18.7 • Payment Fix
          </p>

          <h1>☕ Pi İkizler Cafe</h1>

          <p>
            Hem uygulama içinde hem domain/uzantı adresinde çalışan TestPi sistemi.
          </p>

          <button onClick={handlePiPayment}>
            Pay with Pi / TestPi ile Öde
          </button>

          <p className="status">
            {paymentStatus}
          </p>

          <p className="mini">
            SDK: {piReady ? 'Hazır ✅' : 'Pi Browser bekleniyor'}
          </p>

        </div>

        <div className="piCoin">
          π
        </div>
      </section>

      <section className="panel">

        <h2>🛒 Sepet</h2>

        {cart.length === 0 ? (
          <p>Sepet boş</p>
        ) : (
          <>
            {cart.map((item, index) => (
              <div key={index} className="cartRow">
                <span>
                  {item.icon} {item.name}
                </span>

                <b>
                  {item.price.toFixed(2)} Pi
                </b>
              </div>
            ))}

            <div className="total">
              <span>Toplam</span>
              <strong>{total.toFixed(2)} Pi</strong>
            </div>

            <button className="payBtn" onClick={handlePiPayment}>
              Pay with Pi / TestPi ile Öde
            </button>

            <button className="clearBtn" onClick={clearCart}>
              Sepeti Temizle
            </button>
          </>
        )}
      </section>

      <Menu
        title="🔥 Sıcak İçecekler"
        items={drinksHot}
        addToCart={addToCart}
      />

      <Menu
        title="🧊 Soğuk İçecekler"
        items={drinksCold}
        addToCart={addToCart}
      />

      <Menu
        title="🍰 Tatlılar"
        items={desserts}
        addToCart={addToCart}
      />

    </main>
  )
}

function Menu({ title, items, addToCart }) {
  return (
    <section className="card">

      <h2>{title}</h2>

      {items.map((item) => (
        <div className="item" key={item.name}>

          <div className="foodIcon">
            {item.icon}
          </div>

          <div>
            <strong>{item.name}</strong>

            <span>
              {item.note} • {item.price.toFixed(2)} Pi
            </span>
          </div>

          <button onClick={() => addToCart(item)}>
            +
          </button>

        </div>
      ))}

    </section>
  )
}

createRoot(document.getElementById('root')).render(<App />)
