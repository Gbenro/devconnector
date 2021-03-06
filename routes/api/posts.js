const express = require('express')

const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Post Model
const Post = require('../../models/Post')

// Profile Model
const Profile = require('../../models/Profile')

// Validator
const validatePostInput = require('../../validation/post')

// @router GET api/post/test
// @desc Tests post route
// @access Public
router.get('/test', (req, res) => res.json({ msg: 'post works' }))

// @router GET api/posts
// @descG get posts
// @access Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404))
})

// @router GET api/post/:id
// @descG get post by ID/ single post
// @access Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ NoPostFound: 'No Post found with that ID' })
    )
})

// @router POST api/posts
// @desc Create post
// @access Private

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body)
    // Check validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors)
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    })

    newPost
      .save()
      .then(post =>
        res.json(post).json({ NoPostFound: 'No Post found with that ID' })
      )
  }
)

// @router Delete api/posts/:id
// @desc Delete a post
// @access Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notAuthorized: 'user not authorized' })
          }

          // Delete
          post.remove().then(() => res.json({ success: true }))
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }))
    })
  }
)

// @router Delete api/posts/like/:id
// @desc Like a post
// @access Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyLiked: 'User already like this post' })
          }
          // Add the user id to the likes array
          post.likes.unshift({ user: req.user.id })
          post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }))
    })
  }
)

// @router Delete api/posts/unlike/:id
// @desc Like a post
// @access Private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notLiked: 'You have not yet liked this post' })
          }
          // Get the remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id)

          // Splice out of the array
          post.likes.splice(removeIndex, 1)

          // Save
          post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }))
    })
  }
)

// @router POST api/posts/comment/:id
// @desc Add comment to a post
// @access Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body)
    // Check validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors)
    }
    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        }

        // Add to comments array

        post.comments.unshift(newComment)

        // save
        post.save().then(post => res.json(post))
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post fpund' }))
  }
)

// @router DELETE api/posts/comment/:id/:comment_id
// @desc Remove comment from post
// @access Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body)

    Post.findById(req.params.id)
      .then(post => {
        // Check to see if the comment exist
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: 'Comment does not exist' })
        }
        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id)

        // Splice comment out of array
        post.comments.splice(removeIndex, 1)

        post.save().then(post => res.json(post))
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post fpund' }))
  }
)

module.exports = router
