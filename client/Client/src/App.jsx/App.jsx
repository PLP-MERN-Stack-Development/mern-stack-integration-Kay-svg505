// client/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PostList from './pages/PostList';
import PostView from './pages/PostView';
import PostForm from './pages/PostForm';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav className="p-4 bg-white shadow mb-4">
          <div className="container mx-auto flex justify-between">
            <Link to="/" className="font-bold">MERN Blog</Link>
            <div className="flex gap-4">
              <Link to="/create" className="text-sm">Create</Link>
              <Link to="/login" className="text-sm">Login</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts/:id" element={<PostView />} />
          <Route path="/create" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
