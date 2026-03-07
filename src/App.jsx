import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../AuthContext';
import React, { useState } from "react";
import HomePage from './page/HomePage';
import LoginPage from './page/LoginPage';
import RegistrationPage from './page/RegistrationPage';
import GamesPage from './page/GamesPage';
import CartPage from './page/CartPage';
import ReviewsPage from './page/ReviewsPage';
import UpdateGameInventory from './page/UpdateGameInventory.jsx';
import ProfilePage from './page/ProfilePage.jsx';
import EmployeeManagement from './page/EmployeeManagement.jsx';
import StoreManagement from './page/StoreManagement.jsx';
import PublisherManagement from './page/PublisherManagement.jsx';
import PublisherPage from './page/PublisherPage.jsx';
import WishlistPage from './page/WishlistPage.jsx';

function App() {
  const [cart, setCart] = useState([]);
  const [storeData, setStoreData] = useState('');
  const [platformData, setPlatformData] = useState('');

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/registration" element={<RegistrationPage/>} />
          <Route path="/games" element={<GamesPage cart={cart} setCart={setCart} storeData={storeData} setStoreData={setStoreData} 
                          platformData={platformData} setPlatformData={setPlatformData} />} />
          <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} storeData={storeData}  platformData={platformData} />} />
          <Route path="/reviews" element={<ReviewsPage/>} />
          <Route path="/updategame" element={<UpdateGameInventory />} />
          <Route path="/employeemanagement" element={<EmployeeManagement />} />
          <Route path="/storemanagement" element={<StoreManagement />} />
          <Route path="/publishermanagement" element={<PublisherManagement />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/publishers" element={<PublisherPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
