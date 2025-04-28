import { Routes,Route } from "react-router-dom"
import AuthLayout from "./components/auth/AuthLayout"
import Login from "./pages/auth/login"
import Register from "./pages/auth/register"
import AdminLayout from "./components/admin-view/AdminLayout"
import Dashboard from "./pages/admin-view/Dashboard"
import Features from "./pages/admin-view/Features"
import Orders from "./pages/admin-view/Orders"
import Products from "./pages/admin-view/Products"
import PageNotFound from "./pages/PageNotFound"
import ShoppingLayout from "./components/shopping-view/ShoppingLayout"
import Home from "./pages/shopping-view/Home"
import Listing from "./pages/shopping-view/Listing"
import Checkout from "./pages/shopping-view/Checkout"
import Account from "./pages/shopping-view/Account"
import CheckAuth from "./components/common/CheckAuth"


function App() {
  const isAuthenticated=false
  const user=null
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Routes>
        <Route path="*" element={<PageNotFound />} />
          {/* Auth routes */}
          <Route path="/auth" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          {/* Admin Routes */}
          <Route path="/admin" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="features" element={<Features />} />
            <Route path="orders" element={<Orders/>} />
            <Route path="products" element={<Products />} />
          </Route>
           {/* Shopping-view Routes */}
           <Route path="/shop" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>}>
            <Route path="home" element={<Home />} />
            <Route path="listing" element={<Listing />} />
            <Route path="checkout" element={<Checkout/>} />
            <Route path="account" element={<Account />} />
          </Route>
        </Routes>
      </div>
  )
}

export default App
