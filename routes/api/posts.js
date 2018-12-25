const express = require('express')

const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Post Model
const Post = require('../../models/Post')

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
    .then(posts => res.json(post))
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
module.exports = router
