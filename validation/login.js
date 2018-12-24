const isEmpty = require('./is-empty')
const Validator = require('validator')

module.exports = function validateLoginInput (data) {
  let errors = {}

  data.email = !isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty(data.password) ? data.password : ''

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required'
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password filed is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}