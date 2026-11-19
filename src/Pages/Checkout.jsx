import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import { api } from '../api.js'
import './CSS/Checkout.css'

const Checkout = () => {
  const { all_product, cartItems, getTotalCartAmount, loadCart, user } = useContext(ShopContext)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    shipping_name: user?.full_name || '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
  })
  const [loading, setLoading] = useState(false)

  const items = all_product.filter((p) => cartItems[p.id] > 0)
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  if (!localStorage.getItem('token')) {
    return <p style={{ padding: 40 }}>First Login Before Checkout.</p>
  }
  if (items.length === 0) {
    return <p style={{ padding: 40 }}>Your cart is empty.</p>
  }

  const placeOrder = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // cart saaf hone se pehle items ki copy rakh lein
      const snapshot = items.map((p) => ({
        id: p.id, name: p.name, image: p.image,
        price: p.new_price, quantity: cartItems[p.id],
      }))
      const total = getTotalCartAmount()
      const data = await api('/api/orders', { method: 'POST', body: form })
      await loadCart()
      navigate('/order-success', {
        state: { order: data, items: snapshot, shipping: form, total },
      })
    } catch (err) {
      alert(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="checkout">
      <form className="checkout-form" onSubmit={placeOrder}>
        <h2>Shipping Details</h2>
        <input name="shipping_name" value={form.shipping_name} onChange={onChange} placeholder="Full Name is Required" required />
        <input name="shipping_phone" value={form.shipping_phone} onChange={onChange} placeholder="Phone number" required />
        <textarea name="shipping_address" value={form.shipping_address} onChange={onChange} placeholder="Enter Your Complete Address" rows="3" required />
        <input name="shipping_city" value={form.shipping_city} onChange={onChange} placeholder="City" required />
        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : 'Place Order'}
        </button>
      </form>

      <div className="checkout-summary">
        <h2>Order Summary</h2>
        {items.map((p) => (
          <div className="checkout-row" key={p.id}>
            <img src={p.image} alt="" />
            <span>{p.name} × {cartItems[p.id]}</span>
            <b>${(p.new_price * cartItems[p.id]).toFixed(2)}</b>
          </div>
        ))}
        <hr />
        <div className="checkout-row total">
          <span>Total</span>
          <b>${getTotalCartAmount().toFixed(2)}</b>
        </div>
      </div>
    </div>
  )
}

export default Checkout