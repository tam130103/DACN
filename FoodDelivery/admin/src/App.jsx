// FoodDelivery/admin/src/App.jsx
import React from "react";
import Navbar from "./components/navbar/navbar";
import Sidebar from "./components/sidebar/sidebar";
import { Route, Routes } from "react-router-dom";
import List from "./pages/List/List";
import Add from "./pages/Add/Add";
import Orders from "./pages/Orders/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // nhớ import CSS

// Lấy API URL từ ENV khi deploy (fallback khi dev)
const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/list" element={<List url={url} />} />
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
