import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import Login from './components/Login.js';
import Register from './components/Register.js';
import ProductForm from './components/ProductForm.js';
import ProductList from './components/ProductList.js';

import OrderDetail from './components/OrderDetail.js';
import CreateOrder from './components/CreateOrder.js';
import CustomerOrderDetail from './components/CustomerOrderDetail.js';
import CustomerOrderHistory from './components/CustomerOrderHistory.js';
import CustomerList from './components/CustomerList.js';
import StaffOrderList from './components/StaffOrderList.js';
import PendingOrders from './components/PendingOrders.js';
import UpdateOrderStatus from './components/UpdateOrderStatus';

import FAQ from "./components/FAQ";
import InventoryReport from "./components/InventoryReport.js";
import InventoryDetail from "./components/InventoryDetail.js";
import { UserProvider } from './components/UserContext.js';
import Homepage from './components/Homepage.js';
import  Profile from './components/Profile';


function App() {
  return (
  <UserProvider>

        <Router>
      <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/register" element={<Register/>}/>
      <Route path="/profile" element ={<Profile/>}/>
      <Route path="/home" element={<Homepage/>}/>

      <Route path="/product-form" element={<ProductForm/>}/>
      <Route path ="/product-list" element={<ProductList/>}/>

      <Route path ="/order-details" element = {<OrderDetail/>}/>
      <Route path ="/create-order" element = {<CreateOrder/>}/>
      <Route path ="/pending-orders" element = {<PendingOrders/>}/>
      <Route path="/update-order-status" element={<UpdateOrderStatus />} />
      <Route path="/staff-order-list" element = {<StaffOrderList/>}/>
      <Route path ="/customer-order-detail" element={<CustomerOrderDetail/>}/>
      <Route path ="/customer-order-history" element={<CustomerOrderHistory/>}/>

      <Route path="/customer-list" element={<CustomerList/>}/>

      <Route path ="/inventory-report" element={<InventoryReport/>}/>
      <Route path ="/inventory-detail" element={<InventoryDetail/>}/>
      <Route path ="/faq" element={<FAQ/>}/>
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
