import { useState, useEffect } from "react";
import { postService } from "../services/api";

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const data = await postService.getAllPosts();
    setPosts(data.posts || data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, fetchPosts };
};
