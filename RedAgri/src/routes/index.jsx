import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Traceability from '../pages/Traceability';
import Shop from '../pages/Shop';
import Accounting from '../pages/Accounting';
import Login from '../pages/Login';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/traceability" element={<Traceability />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/accounting" element={<Accounting />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;