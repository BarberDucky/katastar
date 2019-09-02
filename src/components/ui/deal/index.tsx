import React, { Component } from 'react'
import { RouterState, Push, push } from 'connected-react-router';
import { match } from 'react-router';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';
import User from '../../../models/user.model';
import Deal, { Asset } from '../../../models/deal.model';
import { readDeal } from '../../../services/deal.service';
import { fetchDeal } from '../../../thunks/deal.thunk';
import { Loader } from 'semantic-ui-react';
import ParcelSelector from './parcel-selector';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`

const SelectorsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;

  > * + * {
    margin-left: 3em;
  }
`

interface StateProps {
  router: RouterState
  user: User
  currentDeal: Deal
}

interface DispatchProps {
  push: Push
  fetchDeal: typeof fetchDeal
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
}

class DealPage extends Component<Props, State> {
  _isMounted = false
  state: State = {
    isLoading: true,
  }

  public componentDidMount() {
    this._isMounted = true
    this.onRouteChange()
  }

  public componentWillUnmount() {
    this._isMounted = false
  }

  private async onRouteChange() {
    this.setState({ isLoading: true })
    const deal = await readDeal(
      this.props.match.params.dealId,
      this.props.user.address,
    )
    if (deal) {
      this.props.fetchDeal(
        this.props.currentDeal.id,
        deal.id,
        this.props.user.address)
    }

    if (this._isMounted)
      this.setState({ isLoading: false })
  }

  render() {
    const deal = this.props.currentDeal
    const userId = this.props.user.address

    const userAsset: Asset = deal.user1Asset.userAddress === userId ? deal.user1Asset : deal.user2Asset
    const otherAsset: Asset = deal.user1Asset.userAddress === userId ? deal.user2Asset : deal.user1Asset

    console.log('ASSETS', userAsset, otherAsset)

    return (
      <Wrapper>
        {
          this.state.isLoading ? (
            <Loader active />
          ) : !deal.address ? (
            'Error loading deal.'
          ) : (
              <SelectorsWrapper>
                <ParcelSelector assets={userAsset} isOwner={true} />
                <ParcelSelector assets={otherAsset} isOwner={false} />
              </SelectorsWrapper>
          )
        }
      </Wrapper>
    )
  }

}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({
  router: state.router,
  user: state.user,
  currentDeal: state.currentDeal
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
  bindActionCreators(
    {
      push,
      fetchDeal,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(DealPage)