// server/controllers/posts.js
const Post = require('../models/Post');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// GET /api/posts?page=&limit=&category=&q=
exports.getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || null;
    const q = req.query.q || req.query.search || null;

    const filter = {};
    if (category && mongoose.Types.ObjectId.isValid(category)) filter.category = category;
    if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
    ];

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success:true, data: posts, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const idOrSlug = req.params.id;
    let post;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      post = await Post.findById(idOrSlug).populate('author', 'name').populate('category','name');
    } else {
      post = await Post.findOne({ slug: idOrSlug }).populate('author', 'name').populate('category','name');
    }
    if (!post) return res.status(404).json({ success:false, error: 'Post not found' });
    await post.incrementViewCount();
    res.json({ success:true, data: post });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success:false, errors: errors.array() });

    const payload = req.body;
    if (req.file) payload.featuredImage = `/uploads/${req.file.filename}`;
    payload.author = req.user._id;

    // ensure category exists
    if (payload.category && !(await Category.findById(payload.category))) {
      return res.status(400).json({ success:false, error: 'Invalid category' });
    }

    const post = await Post.create(payload);
    res.status(201).json({ success:true, data: post });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success:false, error: 'Post not found' });

    // only author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success:false, error: 'Not allowed' });
    }

    if (req.file) req.body.featuredImage = `/uploads/${req.file.filename}`;

    Object.assign(post, req.body);
    await post.save();
    res.json({ success:true, data: post });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success:false, error: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success:false, error: 'Not allowed' });
    }

    await post.remove();
    res.json({ success:true, message: 'Post deleted' });
  } catch (err) { next(err); }
};

// POST /api/posts/:id/comments
exports.addComment = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ success:false, error: 'Comment required' });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success:false, error: 'Post not found' });

    await post.addComment(req.user._id, content);
    res.status(201).json({ success:true, data: post });
  } catch (err) { next(err); }
};
