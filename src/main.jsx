import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

const drinksHot = [
  { name: 'Türk Kahvesi', price: 0.05, icon: '☕', note: 'Köz tadında klasik' },
  { name: 'Latte', price: 0.07, icon: '🥛', note: 'Sütlü özel kahve' },
  { name: 'Çay', price: 0.03, icon: '🫖', note: 'Taze dem' }
]

const drinksCold = [
  { name: 'Ice Latte', price: 0.08, icon: '🧊', note: 'Soğuk kahve' },
  { name: 'Limonata', price: 0.06, icon: '🍋', note: 'Ev yapımı' },
  { name: 'Soğuk Çay', price: 0.05, icon: '🥤', note: 'Ferahlık' }
]

const desserts = [
  { name: 'Cheesecake', price: 0.09, icon: '🍰', note: 'Frambuazlı' },
  { name: 'Brownie', price: 0.08, icon: '🍫', note: 'Çikolatalı' },
  { name: 'Baklava', price: 0.10, icon: '🥮', note: 'Antep usulü' }
]

function App() {
  const [cart, setCart] = useState([])
  const [paymentStatus, setPaymentStatus] = useState('TestPi ödeme hazır')
  const [piReady, setPiReady] = useState(false)

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price, 0)
  }, [cart])

  useEffect(() => {
    const checkPi = setInterval(() => {
      if (window.Pi) {
        try {
          window.Pi.init({ version: '2.0', sandbox: true })
          setPiReady(true)
          setPaymentStatus('Pi SDK hazır ✅')
          clearInterval(checkPi)
        } catch (error) {
          console.error('Pi init hatası:', error)
        }
      }
    }, 500)

    return () => clearInterval(checkPi)
  }, [])

  const addToCart = (item) => {
    setCart((prev) => [...prev, item])
    setPaymentStatus(`${item.name} sepete eklendi`)
  }

  const clearCart = () => {
    setCart([])
    setPaymentStatus('Sepet temizlendi')
  }

  const payWithPi = async () => {
    if (!window.Pi) {
      setPaymentStatus('Pi Browser içinde açman gerekiyor')
      return
    }

    if (cart.length === 0) {
      setPaymentStatus('Sepet boş')
      return
    }

    setPaymentStatus('Pi kullanıcı doğrulanıyor...')

    try {
      await window.Pi.authenticate(['payments'], function (payment) {
        console.log('Tamamlanmamış ödeme:', payment)
      })

      setPaymentStatus('TestPi ödeme başlatılıyor...')

      window.Pi.createPayment(
        {
          amount: Number(total.toFixed(2)),
          memo: 'Pi İkizler Cafe TestPi ödeme',
          metadata: {
            app: 'Pi İkizler Cafe',
            items: cart.map((item) => item.name),
            total: Number(total.toFixed(2))
          }
        },
        {
          onReadyForServerApproval: async function (paymentId) {
            const res = await fetch('/api/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId })
            })

            if (!res.ok) {
              throw new Error('Server approval hatası')
            }
          },

          onReadyForServerCompletion: async function (paymentId, txid) {
            const res = await fetch('/api/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid })
            })

            if (!res.ok) {
              throw new Error('Server complete hatası')
            }

            setPaymentStatus('Ödeme tamamlandı ✅')
            clearCart()
          },

          onCancel: function () {
            setPaymentStatus('Ödeme iptal edildi')
          },

          onError: function (error) {
            console.error('Pi ödeme hatası:', error)
            setPaymentStatus('Ödeme hatası: ' + (error?.message || 'Bilinmeyen hata'))
          }
        }
      )
    } catch (error) {
      console.error(error)
      setPaymentStatus('Ödeme başlatılamadı: ' + (error?.message || 'Bilinmeyen hata'))
    }
  }

  return (
    <main className="app">
      <section className="hero">
        <div>
          <h1>Pi İkizler Cafe</h1>
          <p className="status">{paymentStatus}</p>
          <p className="mini">
            SDK: {piReady ? 'Hazır ✅' : 'Pi Browser bekleniyor'}
          </p>
        </div>

        <div className="piCoin">π</div>
      </section>

      <section className="panel">
        <h2>🛒 Sepet</h2>

        {cart.length === 0 ? (
          <p>Sepet boş</p>
        ) : (
          <>
            {cart.map((item, index) => (
              <div key={`${item.name}-${index}`} className="cartRow">
                <span>{item.icon} {item.name}</span>
                <b>{item.price.toFixed(2)} Pi</b>
              </div>
            ))}

            <div className="total">
              <span>Toplam</span>
              <strong>{total.toFixed(2)} Pi</strong>
            </div>

            <button type="button" className="payBtn" onClick={payWithPi}>
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
