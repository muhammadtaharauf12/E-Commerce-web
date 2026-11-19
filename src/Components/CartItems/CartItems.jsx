import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";
import { api } from "../../api.js";
import { useNavigate } from "react-router-dom";

const CartItems = () => {
  const navigate = useNavigate();
  const { all_product, cartItems, removeFromCart, getTotalCartAmount, loadCart } =
    useContext(ShopContext);

 

  return (
    <div className="CartItems">
      <div className="cartItems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartItems-format cartItems-format-main">
                <img src={e.image} alt="" className="carticon-product-icon" />
                <p>{e.name}</p>
                <p>${e.new_price}</p>
                <button className="cartItems-quantity">{cartItems[e.id]}</button>
                <p>${(e.new_price * cartItems[e.id]).toFixed(2)}</p>
                <img
                  className="cartItems-remove-icon"
                  src={remove_icon}
                  onClick={() => removeFromCart(e.id)}
                  alt=""
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      <div className="cartItems-checkout">
        <h3>Total: ${getTotalCartAmount().toFixed(2)}</h3>
       <button onClick={() => navigate("/checkout")}>Proceed To Checkout</button>
      </div>
    </div>
  );
};

export default CartItems;