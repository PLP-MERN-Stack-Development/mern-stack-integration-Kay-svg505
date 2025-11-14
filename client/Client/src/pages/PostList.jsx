// client/src/pages/PostList.jsx
import React, { useEffect, useState } from 'react';
import { postService, categoryService } from '../api';
import { Link } from 'react-router-dom';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await postService.getAllPosts(page, limit, category ? category._id : null);
      setPosts(res.data);
      setMeta(res.meta || {});
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page, category]);

  useEffect(() => {
    categoryService.getAllCategories().then(r => setCategories(r.data)).catch(()=>{});
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await postService.searchPosts(q);
      setPosts(res.data);
      setMeta(res.meta || {});
    } catch (err) { console.error(err); }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4 mb-4">
        <form className="flex-grow" onSubmit={handleSearch}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search posts..." className="w-full p-2 border rounded" />
        </form>
        <select value={category ? category._id : ''} onChange={e => setCategory(categories.find(c=>c._id===e.target.value) || null)} className="p-2 border rounded">
          <option value="">All categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map(p => (
            <article key={p._id} className="border rounded p-4 shadow">
              {p.featuredImage && <img src={p.featuredImage.startsWith('/') ? p.featuredImage : p.featuredImage} alt={p.title} className="w-full h-40 object-cover mb-2 rounded" />}
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.excerpt || p.content.substring(0,120) + '...'}</p>
              <div className="mt-2 flex justify-between items-center">
                <Link to={`/posts/${p.slug}`} className="text-blue-600">Read</Link>
                <span className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-4 py-2 rounded border">Prev</button>
        <div>Page {meta.page || page} / {meta.totalPages || '-'}</div>
        <button disabled={meta.totalPages && page>=meta.totalPages} onClick={()=>setPage(p=>p+1)} className="px-4 py-2 rounded border">Next</button>
      </div>
    </div>
  );
}
