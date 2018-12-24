const express = require('express')

const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')

// Load User modal
const User = require('../../models/User')

// @router GET api/users/test
// @desc Tests users route
// @access Public
router.get('/test', (req, res) => res.json({ msg: 'users works' }))

// @router GET api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
  // check if email already exist if it does create new user
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'Email already exist' })
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // size
        r: 'pg', // rating
        d: 'mm' // default
      })
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      })

      // decrypt password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err))
        })
      })
    }
  })
})

// @router GET api/users/login
// @desc Login user/ returning jwt token
// @access Public
roueter.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  // find user by email
  User.findOne({ email }).then(user => {
    // check for user
    if (!user) {
      return res.status(404).json({ email: 'User not found' })
    }
    // Check Password

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        res.json({ msg: 'Success' })
      } else {
        return res.status(400).json({ password: 'Password Incorrect' })
      }
    })
  })
})
module.exports = router
