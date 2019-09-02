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

interface StateProps {
  router: RouterState
  user: User
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
}

class AuctionPage extends Component<Props, State> {
  _isMounted = false
  state: State = {
    isLoading: true,
    results: undefined,
    isOwner: false,
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

    if (this._isMounted) {
      this.setState({
        isLoading: false,
        results: auction,
        isOwner: auction ? this.props.user.address === auction.owner : false
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
    if (this.state.results)
      await submitBid(this.state.results.address, obj.bid)
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
              <span>{auction.duration}</span>
              <span>{auction.isDone}</span>
              <span>{auction.startingPrice}</span>
              <span onClick={() => this.selectOwner(auction.owner)}>{auction.owner}</span>
              <span onClick={() => this.selectParcel(auction.parcel.address)}>{auction.parcel}</span>

              {
                !this.state.isOwner ? (
                  <div>
                    <form onSubmit={this.submitBid}>
                      <input name="bid"/>
                      <button>Bid</button>
                    </form>
                  </div>
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
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
  bindActionCreators(
    {
      push,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(AuctionPage)