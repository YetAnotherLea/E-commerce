import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Homepage, ProductDetail, Cart, Catalog, Checkout } from "./pages";
import { TestAPI, AdminDashboard } from "./pages";
import { CartProvider } from "./providers";
import { UserAuthProvider } from "./providers";
import { Login, Register, Navbar, ProtectedRoute } from "./components";
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <UserAuthProvider value={{ user, setUser }}>
        <CartProvider>
          <div className="App">
            <Navbar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="ROLE_ADMIN">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </div>
          </div>
        </CartProvider>
      </UserAuthProvider>
    </Router>
  );
}

export default App;
