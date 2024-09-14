import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import Categories from './components/Categories';
import Users from './components/Users';
import Activity from './components/Activity';
import MasterData from './components/MasterData';
import Extract from './components/Extract';
import WebComponent from './components/webComponent';
import { Navigate } from 'react-router-dom';
import Main from './components/Main';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboardView" element={<Main />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/users" element={<Users />} />
        <Route path="/webscraping" element={<Extract />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/products" element={<MasterData />} />
        <Route path="/competitors" element={<WebComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
