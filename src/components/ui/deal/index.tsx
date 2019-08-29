import React, { Component, FormEvent } from 'react'
import { RouterState, Push, push } from 'connected-react-router';
import { match } from 'react-router';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';
import bind from 'bind-decorator';
import { submitBid } from '../../../services/auction.service';
import User from '../../../models/user.model';
import { formDataToJson } from '../../../helper';
import Deal from '../../../models/deal.model';
import { readDeal } from '../../../services/deal.service';

interface StateProps {
  router: RouterState
  user: User
}

interface DispatchProps {
  push: Push
}

interface ParamProps {
  dealId: string
}

interface OwnProps {
  match: match<ParamProps>
}

type Props = StateProps & DispatchProps & OwnProps

interface State {
  isLoading: boolean
  results?: Deal
}

class DealPage extends Component<Props, State> {
  _isMounted = false
  state: State = {
    isLoading: true,
    results: undefined,
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
    const deal = await readDeal(this.props.match.params.dealId, this.props.user.address)

    if (!deal) {
      this.props.push(`/main/users/${this.props.user.address}/deals`)
      return
    }

    if (this._isMounted) {
      this.setState({
        isLoading: false,
        results: deal,
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
    const deal = this.state.results
    return (
      <div>
        {
          this.state.isLoading ? (
            'Loading...'
          ) : !deal ? (
            'Error loading deal.'
          ) : (
            <div>

              <span>{deal.isConfirmed}</span>
              <span>{deal.isWithdrawn}</span>

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

export default connect(mapStateToProps, mapDispatchToProps)(DealPage)