// client/src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email:'', password:'' });
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <form onSubmit={handle} className="space-y-2">
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="email" className="w-full p-2 border rounded" />
        <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="password" className="w-full p-2 border rounded" />
        <button type="submit" className="px-4 py-2 border rounded">Login</button>
      </form>
    </div>
  );
}
