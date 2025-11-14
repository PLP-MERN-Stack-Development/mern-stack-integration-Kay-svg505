// client/src/pages/PostForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import { postService, categoryService } from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    isPublished: false,
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    categoryService.getAllCategories().then(r => setCategories(r.data)).catch(()=>{});
    if (id) {
      postService.getPost(id).then(r=>{
        const p = r.data;
        setForm({
          title: p.title,
          content: p.content,
          excerpt: p.excerpt || '',
          category: p.category?._id || '',
          tags: (p.tags || []).join(','),
          isPublished: p.isPublished,
        });
      }).catch(err=>console.error(err));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');

    // send as multipart if image present
    const data = new FormData();
    data.append('title', form.title);
    data.append('content', form.content);
    data.append('excerpt', form.excerpt);
    data.append('category', form.category);
    data.append('tags', form.tags);
    data.append('isPublished', form.isPublished);
    if (image) data.append('featuredImage', image);

    try {
      setLoading(true);
      if (id) {
        await api.put(`/posts/${id}`, data); // use axios instance
      } else {
        await api.post('/posts', data);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <input value={form.title} onChange={e=>setForm({...form, title: e.target.value})} placeholder="Title" className="w-full p-2 border rounded mb-2" />
        <select value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="w-full p-2 border rounded mb-2">
          <option value="">Select category</option>
          {categories.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input value={form.excerpt} onChange={e=>setForm({...form, excerpt: e.target.value})} placeholder="Excerpt" className="w-full p-2 border rounded mb-2" />
        <textarea value={form.content} onChange={e=>setForm({...form, content: e.target.value})} rows="10" placeholder="Content (HTML allowed)" className="w-full p-2 border rounded mb-2" />
        <input value={form.tags} onChange={e=>setForm({...form, tags: e.target.value})} placeholder="tags,comma,separated" className="w-full p-2 border rounded mb-2" />
        <input type="file" accept="image/*" onChange={e=>setImage(e.target.files[0])} className="mb-2" />
        <div className="mb-4">
          <label className="mr-2"><input type="checkbox" checked={form.isPublished} onChange={e=>setForm({...form, isPublished: e.target.checked})} /> Publish</label>
        </div>
        <button disabled={loading} type="submit" className="px-4 py-2 border rounded">{id ? 'Update' : 'Create'} Post</button>
      </form>
    </div>
  );
}
