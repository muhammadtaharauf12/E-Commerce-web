
import React from 'react'
import { useLocation, Link } from 'react-router-dom'

import './CSS/OrderSuccess.css'

const OrderSuccess = () => {
  const { state } = useLocation()

  if (!state) {
    return (
      <div className="order-page">
        <p>No order found.</p>
        <Link to="/orders">View My Orders</Link>
      </div>
    )
  }

  const { order, items, shipping, total } = state
  const orderId = order.order_id || order.id || order.order?.id

  return (
    <div className="order-page">

      <h1 className="success-heading">
        <span>✓</span> Order placed successfully!
      </h1>

      {orderId && (
        <p className="order-id">
          Order ID: <b>#{orderId}</b>
        </p>
      )}

      {/* Items Card */}
      <div className="order-card items-card">
        <h3>Order Items</h3>

        {items.map((p) => (
          <div className="checkout-row" key={p.id}>
            <img src={p.image} alt={p.name} />
            <span>{p.name} × {p.quantity}</span>
            <b>${(p.price * p.quantity).toFixed(2)}</b>
          </div>
        ))}

        <hr />

        <div className="checkout-row total">
          <span>Total Amount</span>
          <b>${Number(order.total ?? total).toFixed(2)}</b>
        </div>
      </div>

      {/* Shipping Card */}
      <div className="order-card shipping-card">
        <h3>Shipping Details</h3>

        <div className="shipping-info">
          <div className="shipping-detail">
            <span className="shipping-label">Full Name</span>
            <p>{shipping.shipping_name}</p>
          </div>

          <div className="shipping-detail">
            <span className="shipping-label">Phone Number</span>
            <p>{shipping.shipping_phone}</p>
          </div>

          <div className="shipping-detail">
            <span className="shipping-label">Delivery Address</span>
            <p>{shipping.shipping_address}, {shipping.shipping_city}</p>
          </div>
        </div>
      </div>

      <Link to="/orders" className="orders-link">
        <button className="orders-btn">My Orders</button>
      </Link>

    </div>
  )
}

export default OrderSuccess
