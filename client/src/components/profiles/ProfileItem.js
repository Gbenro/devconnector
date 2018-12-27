import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-type'
import Spinner from '../common/spinner.gif'
import { getProfiles } from '../../actions/profileActions'

class ProfileItem extends Component {
  componentDidMount () {
    this.props.getProfiles()
  }
  render () {
    const { profiles, loading } = this.props.profile

    let profileItems

    if (profile == null || loading) {
      profileItems = <Spiner />
    } else {
      if (profile.lenght > 0) {
        profileItems = <h1>PROFILES HERE</h1>
      } else {
        profileitems = <h4>No profiles found...</h4>
      }
    }
    return (
      <div className='profiles'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='display-4 text-center'> Developer Profiles</div>
              <p className='lead text-center'>
                Browse and connect with developers
              </p>
              {profileItems}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ProfileItem.propTypes = {
  getProfile: PropTypes.func.isRequired,
  Profile: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(
  mapStateToProps,
  { getProfiles }
)(ProfileItem)
