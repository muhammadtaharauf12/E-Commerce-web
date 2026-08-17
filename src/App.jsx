

import './App.css'
import Navbar from './Components/Navbar/Navbar.jsx'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Shop from './Pages/shop.jsx'
import ShopCategory from './Pages/ShopCategory.jsx'
import product from './Pages/product.jsx'
import cart from './Pages/cart.jsx'
import loginSignup from './Pages/loginSignup.jsx'

function App() {


  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Shop/>}/>
      <Route path='/mens' element={<ShopCategory category='men'/>}/>
      <Route path='/womens' element={<ShopCategory category='women'/>}/>
      <Route path='/kids' element={<ShopCategory category='kid'/>}/>
      <Route path='/product' element={<product/>}>
      <Route path=':productId' element={<product/>}/>
      </Route>
      <Route path='/cart' element={<cart/>}/>
      <Route path='/login' element={<loginSignup/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
