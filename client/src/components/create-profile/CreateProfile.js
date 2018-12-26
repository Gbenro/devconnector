import React, { Component } from 'react'

import { connect } from 'react-redux'
import PropType from 'prop-types'
import TextFieldGroup from '../common/TextFieldGroup'
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'
import SelectListGroup from '../common/SelectListGroup'
import InputGroup from '../common/InputGroup'
class CreateProfile extends Component {
  state = {
    displaySocialInputs: false,
    handle: '',
    company: '',
    website: '',
    location: '',
    status: '',
    skills: '',
    githubusername: '',
    bio: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    instagram: '',
    errors: {}
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit = e => {
    e.preventDefault()
  }
  render () {
    const { errors } = this.state
    return (
      <div className='create-profile'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-8 m-auto'>
              <h1 className='display-4 text-center'>Create Your Profile</h1>
              <p className='lead text-center'>
                Let's get some info tomake your profile stand out
              </p>
              <small className='d-block pb-3'>* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder='* Profile Handle'
                  name='handle'
                  value={this.state.handle}
                  error={errors.handle}
                  info='A unique handle for your profile URL. Your full name, company name, nickname, etc'
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
CreateProfile.propType = {
  profile: PropType.object.isRequired,
  errors: PropType.object.isRequired
}

const mapStataToProps = state => ({
  profile: state.profile,
  errors: state.errors
})
export default connect(mapStataToProps)(CreateProfile)
