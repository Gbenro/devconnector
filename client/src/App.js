import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import setAuthToken from './utils/setAuthToken'
import { setCurrentUser, logoutUser } from './actions/authAction'
import { Provider } from 'react-redux'
import store from './store'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Landing from './components/layout/Landing'
import Register from './components/Auth/Register'
import Login from './components/Auth/Login'

import './App.css'

// Check for Token
if (localStorage.jwtToken) {
  // Set Auth Token header auth
  setAuthToken(localStorage.jwtToken)
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken)
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded))

  // Check for expired Tokens
  const currentTime = Date.now() / 1000
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser())
    // ToDo: Clear Current Profile
    // Redirect to login
    window.location.href = '/login'
  }
}
class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <Router>
          <div className='App'>
            <Navbar />
            <Route exact path='/' component={Landing} />
            <div className='container'>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App
