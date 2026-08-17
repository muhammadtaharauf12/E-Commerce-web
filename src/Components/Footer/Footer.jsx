import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/logo_big.png'

const Footer = () => {
  return (
    <div className='footer'>
        <div className="footer-logo">
            <img src={footer_logo} alt="" />
            <p>SHOPPER</p>
        </div>
        <ul className="footer-links">
            <li>Cmpany</li>
             <li>About</li>
              <li>Offices</li>
               <li>About</li>
                <li>Contact</li>
        </ul>
        <div className="footer-socail-icon">
            
        </div>

     </div>
  )
}

export default Footer