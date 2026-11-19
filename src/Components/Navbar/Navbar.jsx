
import React, { useState, useContext } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext.jsx";

const Navbar = () => {
  const [menu, setMenu] = useState("shop");

  const { getTotalCartItems, user, logout } = useContext(ShopContext);

  return (
    <div className="navbar">

      <div className="nav-logo">
        <img src={logo} alt="Shopper Logo" />
        <p>SHOPPER</p>
      </div>

      <ul className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          <Link to="/">Shop</Link>
          {menu === "shop" && <hr />}
        </li>

        <li onClick={() => setMenu("mens")}>
          <Link to="/mens">Men</Link>
          {menu === "mens" && <hr />}
        </li>

        <li onClick={() => setMenu("womens")}>
          <Link to="/womens">Women</Link>
          {menu === "womens" && <hr />}
        </li>

        <li onClick={() => setMenu("kids")}>
          <Link to="/kids">Kids</Link>
          {menu === "kids" && <hr />}
        </li>
      </ul>

      <div className="nav-login-cart">

        {user ? (
          <>
            <Link to="/orders" className="nav-button">
              My Orders
            </Link>

            <button onClick={logout} className="nav-button">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-button">
            Login
          </Link>
        )}

        <Link to="/cart" className="nav-cart">
          <img src={cart_icon} alt="Shopping Cart" />

          <div className="nav-cart-count">
            {getTotalCartItems()}
          </div>
        </Link>

      </div>
    </div>
  );
};

export default Navbar;
