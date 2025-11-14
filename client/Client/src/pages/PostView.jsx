// client/src/pages/PostView.jsx
import React, { useEffect, useState, useContext } from 'react';
import { postService } from '../api';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PostView() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await postService.getPost(id);
      setPost(res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return (window.location.href = '/login');
    try {
      await postService.addComment(post._id, { content: comment });
      setComment('');
      fetch(); // re-fetch comments (simple)
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !post) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <article>
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-4">By {post.author?.name} • {new Date(post.createdAt).toLocaleString()}</div>
        {post.featuredImage && <img src={post.featuredImage} alt="" className="w-full h-64 object-cover rounded mb-4" />}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <section className="mt-8">
        <h3 className="text-lg font-semibold">Comments ({post.comments?.length || 0})</h3>
        <ul className="mt-2">
          {post.comments && post.comments.map(c => (
            <li key={c._id} className="border-b py-2">
              <div className="text-sm text-gray-700">{c.content}</div>
              <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>

        <form onSubmit={handleComment} className="mt-4">
          <textarea value={comment} onChange={e=>setComment(e.target.value)} className="w-full p-2 border rounded" placeholder="Write a comment..." />
          <button type="submit" className="mt-2 px-4 py-2 rounded border">Add Comment</button>
        </form>
      </section>
    </div>
  );
}
