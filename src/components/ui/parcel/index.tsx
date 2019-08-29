import React, { Component } from 'react'
import { RouterState, Push, push } from 'connected-react-router';
import { match } from 'react-router';
import Parcel from '../../../models/parcel.model';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';
import { readParcel } from '../../../services/parcel.service';
import bind from 'bind-decorator';

interface StateProps {
  router: RouterState
}

interface DispatchProps {
  push: Push
}

interface ParamProps {
  parcelId: string
}

interface OwnProps {
  match: match<ParamProps>
}

type Props = StateProps & DispatchProps & OwnProps

interface State {
  isLoading: boolean,
  results?: Parcel
}

class ParcelPage extends Component<Props, State> {
  _isMounted = false
  state: State = {
    isLoading: true,
    results: undefined
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
    const parcel = await readParcel(this.props.match.params.parcelId)

    if (this._isMounted) {
      this.setState({
        isLoading: false,
        results: parcel
      })
    }
  }

  @bind
  private selectOwner(ownerId: string) {
    this.props.push(`/main/users/${ownerId}`)
  }

  render () {
    const parcel = this.state.results
    return (
      <div>
        {
          this.state.isLoading ? (
            'Loading...'
          ) : !parcel ? (
            'Error loading user.'
          ) : (
            <div>
              <span>{parcel.address}</span>
              <span>{parcel.cadastreMunicipality}</span>
              <span>{parcel.municipality}</span>
              <span onClick={() => this.selectOwner(parcel.owner)}>{parcel.owner}</span>
              <span>{parcel.region}</span>
            </div>
          )
        }
      </div>
    )
  }

}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({
  router: state.router,
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
  bindActionCreators(
    {
      push,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(ParcelPage)