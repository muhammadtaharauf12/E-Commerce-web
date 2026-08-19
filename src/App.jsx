

import './App.css'
import Navbar from './Components/Navbar/Navbar.jsx'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Shop from './Pages/shop.jsx'
import ShopCategory from './Pages/ShopCategory.jsx'
import product from './Pages/product.jsx'
import cart from './Pages/cart.jsx'
import loginSignup from './Pages/loginSignup.jsx'
import Footer from './Components/Footer/Footer.jsx'
import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.png'
import kid_banner from './Components/Assets/banner_kids.png'

function App() {


  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Shop/>}/>
      <Route path='/mens' element={<ShopCategory banner={men_banner} category='men'/>}/>
      <Route path='/womens' element={<ShopCategory banner={women_banner} category='women'/>}/>
      <Route path='/kids' element={<ShopCategory banner={kid_banner} category='kid'/>}/>
      <Route path='/product' element={<product/>}>
      <Route path=':productId' element={<product/>}/>
      </Route>
      <Route path='/cart' element={<cart/>}/>
      <Route path='/login' element={<loginSignup/>}/>
    </Routes>
    <Footer/>
    </BrowserRouter>
    </>
  )
}

export default App
