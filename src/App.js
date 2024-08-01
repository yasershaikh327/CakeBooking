// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './pages/Home';
import Cakes from './pages/Cakes';
import Login from './pages/Login';
import Register from './pages/Register';
import Admindashboard from './pages/Admindashboard';
import PastryForm from './pages/PastryForm';
import CustomerTable from './pages/CustomerTable';
import OrderTable from './pages/OrderTable';
import CakesTable from './pages/CakesTable';
import PastryTable from './pages/PastryTable';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cakes" element={<Cakes />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admindashboard" element={<Admindashboard />} />
        <Route path="/pastryform" element={<PastryForm />} />
        <Route path="/ordertable" element={<OrderTable />} />
        <Route path="/customertable" element={<CustomerTable />} />
        <Route path="/cakestable" element={<CakesTable />} />
        <Route path="/pastrytable" element={<PastryTable />} />
      </Routes>
    </Router>
  );
}

export default App;
