import React, { Component } from 'react'
import { push } from 'connected-react-router';
import { loadUser } from '../../store/user/actions';
import User from '../../models/user.model';
import { connect } from 'react-redux';
import { enableEthereum } from '../../services/ethereum.service';
import { loadUserAndRoute } from '../../thunks/auth';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';

interface ConfirmConnectionProps {
  push: typeof push,
  loadUser: typeof loadUser,
  loadUserAndRoute: typeof loadUserAndRoute,
  user: User
}

class ConfirmConnection extends Component<ConfirmConnectionProps> {

  async retryConnection() {
    let connectionResult = enableEthereum(window.ethereum)

    if (!connectionResult) {
      return
    }

    await this.props.loadUserAndRoute()

  }

  render() {
    return (
      <div>
        <span>Please confirm the usage of MetaMask</span>
        <br />
        <button onClick={() => this.retryConnection()}>Try again...</button>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
  bindActionCreators(
    {
      push,
      loadUser,
      loadUserAndRoute
    },
    dispatch
  )

export default connect(null, mapDispatchToProps)(ConfirmConnection)