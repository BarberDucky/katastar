import React, { Component, FormEvent } from 'react'
import { RouterState, Push, push } from 'connected-react-router';
import { match } from 'react-router';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';
import bind from 'bind-decorator';
import Auction from '../../../models/auction.model';
import { readAuction, submitBid } from '../../../services/auction.service';
import User from '../../../models/user.model';
import { formDataToJson } from '../../../helper';
import Inheritance from '../../../models/inheritance.model';
import { readInheritance, readInheritanceTime, withdraw } from '../../../services/inheritance.service';
import Web3 from 'web3'
import { Button } from 'semantic-ui-react';

interface StateProps {
  router: RouterState
  user: User
  web3: Web3 | null
}

interface DispatchProps {
  push: Push
}

interface ParamProps {
  inheritanceId: string
}

interface OwnProps {
  match: match<ParamProps>
}

type Props = StateProps & DispatchProps & OwnProps

interface State {
  isOwner: boolean
  isLoading: boolean
  results?: Inheritance
  remainingTime: number
}

class InheritancePage extends Component<Props, State> {
  _isMounted = false
  state: State = {
    isLoading: true,
    results: undefined,
    isOwner: false,
    remainingTime: 1000
  }

  public componentDidMount() {
    this._isMounted = true
    this.onRouteChange()
  }

  public componentWillUnmount() {
    this._isMounted = false
  }

  private async onRouteChange() {
    this.setState({isLoading: true})
    const inheritance = await readInheritance(this.props.match.params.inheritanceId, this.props.user.address)

    let remainingTime = -1

    if (this.props.web3) {
      console.log('getting time')
      remainingTime = await readInheritanceTime(this.props.match.params.inheritanceId, this.props.web3)
      console.log(remainingTime)
    } else {
      alert('no web3')
    }
    
    if (this._isMounted) {
      this.setState({
        isLoading: false,
        results: inheritance,
        isOwner: inheritance ? 
          this.props.user.address === inheritance.from ||
          this.props.user.address === inheritance.to
          : false,
        remainingTime
      })
    }
  }

  @bind
  private selectOwner(ownerId: string) {
    this.props.push(`/main/users/${ownerId}`)
  }

  @bind
  private selectParcel(parcelId: string) {
    this.props.push(`/main/parcels/${parcelId}`)
  }

  @bind
  async withdraw() {
    if (this.state.results && this.props.web3) {
      const result = await withdraw(
        this.state.results,
        this.props.web3,
        this.props.user.address,
        )
      if (result) {
        alert('inheritance withdrawn')
      } else {
        alert('could not withdraw')
      }
    } else {
      alert('no inheritance selected or no web3')
    }
  }

  render () {
    const inheritance = this.state.results
    return (
      <div>
        {
          this.state.isLoading ? (
            'Loading...'
          ) : !inheritance ? (
            'Error loading Inheritance.'
          ) : (
            <div>
              <span>{inheritance.address}</span>
              <span>Remaining Time: {this.state.remainingTime}</span>
              <span>Is Withdrawn: {inheritance.isWithdrawn}</span>
              <span onClick={() => this.selectOwner(inheritance.from)}>{inheritance.from}</span>
              <span onClick={() => this.selectOwner(inheritance.to)}>{inheritance.to}</span>
              <span onClick={() => this.selectParcel(inheritance.parcel)}>{inheritance.parcel}</span>

              {
                this.state.isOwner ? (
                  <Button onClick={() => this.withdraw()}>Withdraw</Button>
                ) : (
                  ''
                )
              }

            </div>
          )
        }
      </div>
    )
  }

}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({
  router: state.router,
  user: state.user,
  web3: state.ethereumWeb3.web3
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
  bindActionCreators(
    {
      push,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(InheritancePage)