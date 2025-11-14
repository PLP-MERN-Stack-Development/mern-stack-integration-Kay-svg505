// server/routes/posts.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const postsCtrl = require('../controllers/posts');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// list + search + pagination
router.get('/', postsCtrl.getAll);

// get one by id or slug
router.get('/:id', postsCtrl.getOne);

// create post (with optional image upload)
router.post(
  '/',
  protect,
  upload.single('featuredImage'),
  [
    check('title','Title is required').notEmpty(),
    check('content','Content is required').notEmpty(),
    check('category','Category is required').notEmpty(),
  ],
  postsCtrl.create
);

// update (image optional)
router.put('/:id', protect, upload.single('featuredImage'), postsCtrl.update);

// delete
router.delete('/:id', protect, postsCtrl.remove);

// comments
router.post('/:id/comments', protect, postsCtrl.addComment);

module.exports = router;
