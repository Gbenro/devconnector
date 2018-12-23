const express = require('express')
const mongoose = require('mongoose')

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()

// DB Config
const db = require('./config/Keys').mongoURI
// const db = 'mongodb://gbenro:gbenro23@ds243254.mlab.com:43254/devconnector'

// Connect to MongoDB
mongoose
  .connect(
    db,
    {
      auth: {
        user: 'gbenro',
        password: 'gbenro23'
      },
      useNewUrlParser: true
    }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello!!'))

// use Routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

const port = process.env.Port || 5000

app.listen(port, () => console.log(`Server running on port : ${port}`))
