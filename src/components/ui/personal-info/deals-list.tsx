import React, { Component } from 'react'
import { RouterState, Push, push } from 'connected-react-router';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { bindActionCreators, AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import bind from 'bind-decorator';
import User from '../../../models/user.model';
import Deal from '../../../models/deal.model';
import { withdrawDeal } from '../../../services/deal.service';

interface StateProps {
  router: RouterState
  user: User
}

interface DispatchProps {
  push: Push
}

interface OwnProps {
  isOwner: boolean
  deals: Deal[]
}

type Props = StateProps & DispatchProps & OwnProps

interface State {
  users: User[]
}

class DealsList extends Component<Props, State> {

  state: State = {
    users: []
  }

  @bind
  private openDetails(deal: Deal) {
    this.props.push(`/main/deals/${deal.id}`)
  }

  @bind
  private withdrawDeal(deal: Deal) {
    withdrawDeal(deal)
  }

  render() {
    return (
      <div>
        {
          this.props.deals.length === 0 ? (
            'User has made no deals.'
          ) : (
              <table>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>User 1 address</th>
                    <th>User 1 Eth</th>
                    <th>User 1 Parcel Number</th>
                    <th>User 2 address</th>
                    <th>User 2 Eth</th>
                    <th>User 2 Parcel Number</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.props.deals.map(deal => {
                      return (
                        <tr key={`userDeals${deal.address}`}
                          onClick={() => this.openDetails(deal)}
                        >
                          <td>{deal.address}</td>
                          <td>{deal.user1Asset.userAddress}</td>
                          <td>{deal.user1Asset.eth}</td>
                          <td>{deal.user1Asset.parcels.length}</td>
                          <td>{deal.user2Asset.userAddress}</td>
                          <td>{deal.user2Asset.eth}</td>
                          <td>{deal.user2Asset.parcels.length}</td>
                          <td><button onClick={() => this.withdrawDeal(deal)}>Withdraw</button></td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            )
        }
      </div>
    )
  }
}


const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({
  router: state.router,
  user: state.user
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
  bindActionCreators(
    {
      push,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(DealsList)