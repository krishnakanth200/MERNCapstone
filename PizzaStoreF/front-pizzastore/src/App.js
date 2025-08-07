import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoadingProvider } from './Context/LoadingContext'; // Ensure this path is correct
import { AuthProvider } from './Context/AuthContext'; // Ensure this path is correct
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import Header from './components/Header';
import Menu from './components/Menu/Menu';
import Footer from './components/Footer';
import Cart from './components/Cart/Cart';
import ProductList from './components/Menu/ProductList'; // User-facing product list
import ProductDetail from './components/Menu/ProductDetail';
import Contact from './components/Contact';
import CreateOrder from './components/Order/CreateOrder';
import Payment from './components/Payment/Payment';
import Billing from './components/Billing'; // Ensure this is available
import MyBills from './components/Order/MyBill';

// Admin components
import AdminProductList from './components/Admin/AdminProductList'; // Ensure this is correct
import ProductForm from './components/Admin/ProductForm';
import UserOrders from './components/Order/myorders';
import UserManagementPage from './components/Admin/UserManagementPage';
import RevenueManagement from './components/Admin/RevenueManagement';

import ProtectedRoute from './components/ProtectedRoute'; // Ensure this path is correct
import OrderManagement from './components/Admin/OrderMangment';
import { NotificationProvider } from './Context/NotificationContext';
import NotificationList from './components/Notification/NotificationList';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoadingProvider>
          <NotificationProvider>
            <Header />
            <Routes>
              {/* User Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/products/:category" element={<ProductList />} />
              <Route path="/products/detail/:id" element={<ProductDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/create-order" element={<CreateOrder />} />
              <Route path='/mybills' element={<MyBills />} />
              <Route path="/notifications" element={<NotificationList />} />
              <Route path="/myorders" element={<UserOrders />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/billing" element={<Billing />} />

              {/* Admin Routes */}
              <Route path="/admin/products" element={<ProtectedRoute element={AdminProductList} adminOnly />} />
              <Route path="/update-product/:productId" element={<ProtectedRoute element={ProductForm} adminOnly />} />
              <Route path="/update-product" element={<ProtectedRoute element={ProductForm} adminOnly />} />
              <Route path="/admin/orders" element={<ProtectedRoute element={OrderManagement} adminOnly />} />
              <Route path="/admin/users" element={<ProtectedRoute element={UserManagementPage} adminOnly />} />
              <Route path='/admin/revenue' element={<ProtectedRoute element={RevenueManagement} adminOnly />} />

              {/* Uncomment and add routes if you have these components */}
              {/* <Route path="/admin/dashboard" element={<ProtectedRoute element={AdminDashboard} adminOnly />} /> */}
              {/* <Route path="/admin/add-product" element={<ProtectedRoute element={AddProduct} adminOnly />} /> */}
              {/* <Route path="/admin/menu-crud" element={<ProtectedRoute element={MenuCRUD} adminOnly />} /> */}
              {/* <Route path="/admin/order-management" element={<ProtectedRoute element={OrderManagement} adminOnly />} /> */}
              {/* <Route path="/admin/revenue" element={<ProtectedRoute element={Revenue} adminOnly />} /> */}
            </Routes>
            <Footer />
          </NotificationProvider>
        </LoadingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
