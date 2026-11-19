import React, { useEffect, useState } from 'react'
import { api } from '../api.js'
import './CSS/Checkout.css'

const MyOrders = () => {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/api/orders')
      .then(setOrders)
      .catch((e) => setError(e.message))
  }, [])

  if (!localStorage.getItem('token')) return <p style={{ padding: 40 }}>First Login..</p>
  if (error) return <p style={{ padding: 40 }}>Error: {error}</p>
  if (!orders) return <p style={{ padding: 40 }}>Loading...</p>
  if (orders.length === 0) return <p style={{ padding: 40 }}>No Order Found.</p>

  return (
    <div className="order-page">
      <h1>My Orders Details</h1>
      {orders.map((o) => (
        <div className="order-card" key={o.id}>
          <div className="checkout-row">
            <b>Order #{o.id}</b>
            <span>{o.created_at ? new Date(o.created_at).toLocaleString() : ''}</span>
            <b>${Number(o.total).toFixed(2)}</b>
          </div>
          {o.status && <p>Status: {o.status}</p>}
          <p>{o.shipping_name}, {o.shipping_phone}</p>
          <p>{o.shipping_address}, {o.shipping_city}</p>
        </div>
      ))}
    </div>
  )
}

export default MyOrders