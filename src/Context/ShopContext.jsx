import React, { createContext, useState, useEffect } from "react";
import { api } from "../api.js";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [all_product, setAllProduct] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );

  // Products backend se
  useEffect(() => {
    api("/api/products")
      .then((data) =>
        setAllProduct(
          data.map((p) => ({
            ...p,
            image: p.image_url?.startsWith("http")
  ? p.image_url
  : `http://localhost:5000${p.image_url}`,
            new_price: Number(p.new_price),
            old_price: Number(p.old_price),
          }))
        )
      )
      .catch(console.error);
  }, []);

  // Cart backend se (login hone par)
  const loadCart = async () => {
    if (!localStorage.getItem("token")) {
      setCartItems({});
      return;
    }
    try {
      const data = await api("/api/cart");
      const cart = {};
      data.forEach((i) => {
        cart[i.product_id] = (cart[i.product_id] || 0) + i.quantity;
      });
      setCartItems(cart);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCartItems({});
  };

  const addToCart = async (itemId) => {
    if (!localStorage.getItem("token")) {
      alert("Cart mein add karne ke liye pehle login karein");
      window.location.href = "/login";
      return;
    }
    try {
      await api("/api/cart/add", {
        method: "POST",
        body: { product_id: itemId, size: "M" },
      });
      setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    } catch (e) {
      alert(e.message);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await api("/api/cart/remove", {
        method: "POST",
        body: { product_id: itemId, size: "M" },
      });
      setCartItems((prev) => ({
        ...prev,
        [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
      }));
    } catch (e) {
      alert(e.message);
    }
  };

  const getTotalCartItems = () =>
    Object.values(cartItems).reduce((sum, q) => sum + q, 0);

  const getTotalCartAmount = () =>
    all_product.reduce(
      (sum, p) => sum + p.new_price * (cartItems[p.id] || 0),
      0
    );

  const contextValue = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartItems,
    getTotalCartAmount,
    loadCart,
    user,
    login,
    logout,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;