import React from "react";
import "./DescriptionBox.css";

const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-Navigator">
        <div className="descriptionbox-nav-box">Description </div>
        <div className="descriptionbox-nav-box fade">Reviews (122) </div>
      </div>
      <div className="descriptionbox-description">
        <p>
          Discover a seamless e-commerce experience designed to make online
          shopping simple, fast, and enjoyable. Browse a wide range of quality
          products, explore the latest trends, and find everything you need in
          one place. Enjoy a smooth, user-friendly interface with easy
          navigation and a secure shopping experience. From product discovery to
          checkout, every step is designed with convenience in mind. Shop
          smarter, save time, and experience the future of online shopping
          today!
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
