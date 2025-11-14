// client/src/pages/Register.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to register');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <form onSubmit={handle} className="space-y-2">
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" className="w-full p-2 border rounded" />
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" className="w-full p-2 border rounded" />
        <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="Password" className="w-full p-2 border rounded" />
        <button type="submit" className="px-4 py-2 border rounded">Register</button>
      </form>
    </div>
  );
}
