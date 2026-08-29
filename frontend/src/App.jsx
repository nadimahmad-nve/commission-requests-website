import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home"; 
import AdminDashboard from "./AdminDashboard"; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}