import React, { Component, FormEvent } from 'react'
import { RouterState, Push, push } from 'connected-react-router';
import { match } from 'react-router';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';
import bind from 'bind-decorator';
import Auction from '../../../models/auction.model';
import { readAuction, submitBid, readAuctionTime, readHighestBid, withdrawBids, endAuction, withdrawParcel } from '../../../services/auction.service';
import User from '../../../models/user.model';
import { formDataToJson } from '../../../helper';
import { Button } from 'semantic-ui-react';
import Web3 from 'web3'

interface StateProps {
  router: RouterState
  user: User
  web3: Web3 | null
}

interface DispatchProps {
  push: Push
}

interface ParamProps {
  auctionId: string
}

interface OwnProps {
  match: match<ParamProps>
}

type Props = StateProps & DispatchProps & OwnProps

interface State {
  isOwner: boolean
  isLoading: boolean
  results?: Auction
  highestBid: number
  duration: number
}

class AuctionPage extends Component<Props, State> {
  _isMounted = false
  state: State = {
    isLoading: true,
    results: undefined,
    isOwner: false,
    highestBid: -1,
    duration: -1,
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
    const auction = await readAuction(this.props.match.params.auctionId)

    let remainingTime = -1
    let highestBid = -1

    if (this.props.web3) {
      remainingTime = await readAuctionTime(auction.address, this.props.web3)
      highestBid = await readHighestBid(auction.address, this.props.web3)
    } else {
      alert('no web3')
    }
    
    if (this._isMounted) {
      this.setState({
        isLoading: false,
        results: auction,
        isOwner: auction ? this.props.user.address === auction.owner : false,
        duration: remainingTime,
        highestBid
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
  private async submitBid (reactEvent: FormEvent<HTMLFormElement>) {
    const event = reactEvent.nativeEvent as Event
    event.preventDefault()
    const target = event.target as HTMLFormElement
    const formData = new FormData(target)
    let obj = formDataToJson<any>(formData)
    if (this.state.results && this.props.web3) {
      const result = await submitBid(this.state.results, obj.bid, this.props.user.address, this.props.web3)
      alert(result)
    } else {
      alert('no auction or no web3')
    }
  }

  @bind
  async withdrawBids() {
    if (this.state.results && this.props.web3) {
      const result = await withdrawBids(this.state.results, this.props.user.address, this.props.web3)
      alert(result)
    } else {
      alert('no auction or no web3')
    }
  }

  @bind
  async withdrawWinner() {
    if (this.state.results && this.props.web3) {
      const result = await withdrawParcel(this.state.results, this.props.user.address, this.props.web3)
      alert(result)
    } else {
      alert('no auction or no web3')
    }
  }

  @bind
  async endAuction() {
    if (this.state.results && this.props.web3) {
      const result = await endAuction(this.state.results, this.props.user.address, this.props.web3)
      alert(result)
    } else {
      alert('no auction or no web3')
    }
  }

  render () {
    const auction = this.state.results
    return (
      <div>
        {
          this.state.isLoading ? (
            'Loading...'
          ) : !auction ? (
            'Error loading auction.'
          ) : (
            <div>
              <span>{auction.address}</span>
              <span>Remaining Time: {this.state.duration}</span>
              <span>Highest Bid: {this.state.highestBid}</span>
              <span>{auction.isDone}</span>
              <span>{auction.startingPrice}</span>
              <span onClick={() => this.selectOwner(auction.owner)}>{auction.owner}</span>
              <span onClick={() => this.selectParcel(auction.parcel.address)}>{auction.parcel.address}</span>

              {
                !this.state.isOwner ? (
                  <div>
                    <form onSubmit={this.submitBid}>
                      <input name="bid"/>
                      <button>Bid</button>
                    </form>
                    <Button onClick={() => this.withdrawBids()}>Withdraw</Button>
                    <Button onClick={() => this.withdrawWinner()}>Withdraw Won Parcel</Button>
                  
                  </div>
                ) : (
                  <Button onClick={() => this.endAuction()}>Withdraw Eth</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(AuctionPage)