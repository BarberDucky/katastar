import React, { Component } from 'react'
import styled from 'styled-components';
import { Input, Button, Checkbox } from 'semantic-ui-react';
import User from '../../../models/user.model';
import Deal, { Asset } from '../../../models/deal.model';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const Parcels = styled.div`
  display: flex;
  flex-grow: 2;
  width: 100%;
`

const Ethereum = styled.div`
  display: flex;
  width: 100%;
`

const Confirms = styled.div`
  display: flex;
`

const ParcelsList = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
`

const ParcelItem = styled.div`
  display: flex;
  justify-content: space-between;
`

const Buttons = styled.div`
  display: flex;
`

interface StateProps {
  user: User
  currentDeal: Deal
}

interface DispatchProps {

}

interface OwnProps {
  isOwner: boolean
  assets: Asset
}

type Props = StateProps & DispatchProps & OwnProps

interface State {

}

class ParcelSelector extends Component<Props, State> {

  private isConfirmed() {
    return this.props.currentDeal.isConfirmed ||
      this.props.currentDeal.isWithdrawn ||
      this.props.currentDeal.user1Asset.isConfirmed ||
      this.props.currentDeal.user2Asset.isConfirmed
  }


  render() {
    const assetParcels = this.props.assets.parcels ? Object.values(this.props.assets.parcels) : []
    let userParcels = this.props.user.parcels
    userParcels = userParcels ? Object.values(userParcels) : [] 
    return (
      <Wrapper>
        <Parcels>
          <span>Choose parcels:</span>
          <ParcelsList>
            { 
              assetParcels.map(assetParcel => {
                return (
                  <ParcelItem key={`parcelItem${assetParcel}`}>
                    <span>{assetParcel}</span>
                    {
                      this.props.isOwner && !this.isConfirmed() ? (
                        <Buttons>
                          <Button icon="plus"/>
                          <Button icon="delete"/>
                        </Buttons>
                      ) : ('')
                    }
                  </ParcelItem>
                )
              })
            }
            {
              this.props.isOwner && !this.isConfirmed() ? (
                <form>
                  <select>
                    {
                      userParcels
                        .filter(parcel => assetParcels.indexOf(parcel.address) !== -1)
                        .map(parcel => {
                          return (
                            <option
                              key={`userParcelOptions${parcel.address}`}
                              value={parcel.address}
                            >
                              {parcel.address}
                            </option>
                          )
                        })
                    }
                  </select>
                  <button>+</button>
                </form>
              ) : ('')
            }
          </ParcelsList>
        </Parcels>
        <Ethereum>
          <span>Choose ethereum amount:</span>
          {
            this.props.isOwner && !this.isConfirmed() ? (
              <Input placeholder="eg. 3" defaultValue={this.props.assets.eth}/>
            ) : (
              <span>{this.props.assets.eth}</span>
            )
          }
        </Ethereum>
        <Confirms>
          <Checkbox 
            checked={this.props.assets.isConfirmed} 
            label="Confirm action" 
            disabled={
              this.props.currentDeal.isConfirmed ||
              this.props.currentDeal.isWithdrawn ||
              !this.props.isOwner
            }
          />
          {
            this.props.isOwner &&
            this.props.currentDeal.isConfirmed && (
            !this.props.currentDeal.isCompleted ||
            !this.props.currentDeal.isWithdrawn) ? (
              <Button>Withdraw</Button>
            ) : ('')
          }
          {
            this.props.isOwner &&
            this.props.currentDeal.isConfirmed && (
            !this.props.currentDeal.isCompleted ||
            !this.props.currentDeal.isWithdrawn) ? (
              <Button>Pay</Button>
            ) : ('')
          }
          {
            this.props.isOwner &&
            this.props.currentDeal.user1Asset.isConfirmed &&
            this.props.currentDeal.user2Asset.isConfirmed &&
            !this.props.currentDeal.isConfirmed ? (
              <Button>Confirm</Button>
            ) : ('')
          }
        </Confirms>
      </Wrapper>
    )
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({
  user: state.user,
  currentDeal: state.currentDeal
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
  bindActionCreators(
    {
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(ParcelSelector)

