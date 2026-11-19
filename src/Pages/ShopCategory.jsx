
import React, { useContext, useState, useMemo, useRef, useEffect } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/ShopContext'
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import Item from '../Components/Items/Item.jsx'

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext)

  const [sortOrder, setSortOrder] = useState("default")
  const [sortOpen, setSortOpen] = useState(false)

  const sortRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = all_product.filter(
      (item) => item.category === props.category
    )

    if (sortOrder === "low-high") {
      products.sort(
        (a, b) => Number(a.new_price) - Number(b.new_price)
      )
    }

    if (sortOrder === "high-low") {
      products.sort(
        (a, b) => Number(b.new_price) - Number(a.new_price)
      )
    }

    return products
  }, [all_product, props.category, sortOrder])

  const sortOptions = [
    { label: "Sort by", value: "default" },
    { label: "Price: Low to High", value: "low-high" },
    { label: "Price: High to Low", value: "high-low" }
  ]

  const selectedSort = sortOptions.find(
    (option) => option.value === sortOrder
  )

  return (
    <div className='shop-category'>

      <img
        className='shopcategory-banner'
        src={props.banner}
        alt=""
      />

      <div className="shopcategory-indexSort">

        <p>
          <span>Showing 1-{filteredProducts.length}</span>
          {' '}out of {filteredProducts.length} products
        </p>

        {/* Custom Sort Dropdown */}
        <div className="shopcategory-Sort" ref={sortRef}>

          <button
            type="button"
            className="sort-trigger"
            onClick={() => setSortOpen(!sortOpen)}
            aria-expanded={sortOpen}
          >
            <span>{selectedSort?.label || "Sort by"}</span>

            <img
              src={dropdown_icon}
              alt="Dropdown"
              className={sortOpen ? "sort-arrow active" : "sort-arrow"}
            />
          </button>

          {sortOpen && (
            <div className="sort-dropdown">

              {sortOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={`sort-option ${
                    sortOrder === option.value ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSortOrder(option.value)
                    setSortOpen(false)
                  }}
                >
                  {option.label}
                </button>
              ))}

            </div>
          )}

        </div>
      </div>

      <div className="shopcategory-products">
        {filteredProducts.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>

      <div className="shopcategory-loadmore">
        Explore More
      </div>

    </div>
  )
}

export default ShopCategory
