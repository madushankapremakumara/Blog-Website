import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import GlassNavbar from "./components/GlassNavbar";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import BlogDetail from "./pages/BlogDetail";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminPanel from "./pages/AdminPanel";
import PostEditor from "./pages/PostEditor"; // Add this

import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <GlassNavbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/post/:id" element={<BlogDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route 
            path="/admin-panel" 
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-panel/create" 
            element={
              <ProtectedRoute>
                <PostEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-panel/edit/:id" 
            element={
              <ProtectedRoute>
                <PostEditor />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
