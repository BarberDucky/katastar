import React, { Component, SyntheticEvent, SelectHTMLAttributes, ChangeEvent } from 'react'
import styled from 'styled-components';
import { Input, Button, Checkbox } from 'semantic-ui-react';
import User from '../../../models/user.model';
import Deal, { Asset } from '../../../models/deal.model';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';
import bind from 'bind-decorator';
import Parcel from '../../../models/parcel.model';
import { updateDeal, putDealOnChain, payDeal, withdrawDeal } from '../../../services/deal.service';
import Web3 from 'web3'


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
  web3: Web3 | null
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

  @bind
  async selectParcel(parcel: Parcel) {
    let newDeal = this.props.currentDeal
    if (newDeal.user1Asset.userAddress === this.props.user.address) {
      newDeal.user1Asset.parcels = parcel.address
    } else {
      newDeal.user2Asset.parcels = parcel.address
    }
    await updateDeal(newDeal)
  }

  @bind
  async deselectParcel() {
    let newDeal = this.props.currentDeal
    if (newDeal.user1Asset.userAddress === this.props.user.address) {
      newDeal.user1Asset.parcels = ''
    } else {
      newDeal.user2Asset.parcels = ''
    }
    await updateDeal(newDeal)
  }

  @bind 
  async checkDeal() {
    let newDeal = this.props.currentDeal
    if (newDeal.user1Asset.userAddress === this.props.user.address) {
      newDeal.user1Asset.isConfirmed = !newDeal.user1Asset.isConfirmed
    } else {
      newDeal.user2Asset.isConfirmed = !newDeal.user2Asset.isConfirmed
    }
    await updateDeal(newDeal)
  }

  @bind 
  async changeEthereum(ev: ChangeEvent<HTMLInputElement>) {
    const value = ev.target.value
    let newDeal = this.props.currentDeal
    if (newDeal.user1Asset.userAddress === this.props.user.address) {
      newDeal.user1Asset.eth = +value
    } else {
      newDeal.user2Asset.eth = +value
    }
    await updateDeal(newDeal)
  }

  @bind
  async confirmDeal() {
    if (this.props.web3) {
      await putDealOnChain(
        this.props.currentDeal, 
        this.props.web3,
        this.props.user.address,
        )
    } else {
      alert('no web3')
    }
  }

  @bind
  async pay() {
    const {parcels, eth} = this.props.assets
    if (this.props.web3) {
      const res = await payDeal(
        this.props.currentDeal,
        this.props.user.address,
        this.props.web3,
        )
    }
  }

  @bind
  async withdraw() {
    if (this.props.web3) {
      const res = await withdrawDeal(
        this.props.currentDeal,
        this.props.user.address,
        this.props.web3,
        )
        alert(res)
    } else {
      alert('no web3')
    }
  }

  render() {
    const assetParcel = this.props.assets.parcels
    let userParcels = this.props.user.parcels
    userParcels = userParcels ? Object.values(userParcels) : []
    return (
      <Wrapper>
        {
          this.props.isOwner && !this.isConfirmed() ? (
          <Parcels>
            <span>Choose parcels:</span>
            <ParcelsList>
              { 
                userParcels.map(parcel => {
                  return (
                    <ParcelItem 
                      key={`parcelItem${parcel}`}
                      onClick={() => this.selectParcel(parcel)}
                    >
                      <span>{parcel.address}</span>
                      
                    </ParcelItem>
                  )
                })
              }
              <button onClick={() => this.deselectParcel()}>Clear</button>
            </ParcelsList>
          </Parcels> 
          ) : ('') 
        }
        <span>Chosen parcel: {assetParcel}</span>
        <Ethereum>
          <span>Choose ethereum amount:</span>
          {
            this.props.isOwner && !this.isConfirmed() ? (
              <Input 
                type="number"
                placeholder="eg. 3" 
                value={this.props.assets.eth}
                onChange={(ev) => this.changeEthereum(ev)}
              />
            ) : (
              <span>{this.props.assets.eth}</span>
            )
          }
        </Ethereum>
        <Confirms>
          <Checkbox 
            checked={this.props.assets.isConfirmed}
            onChange={() => this.checkDeal()}
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
              <Button onClick={() => this.withdraw()}>Withdraw</Button>
            ) : ('')
          }
          {
            this.props.isOwner &&
            this.props.currentDeal.isConfirmed && (
            !this.props.currentDeal.isCompleted ||
            !this.props.currentDeal.isWithdrawn) ? (
              <Button onClick={() => this.pay()}>Pay</Button>
            ) : ('')
          }
          {
            this.props.isOwner &&
            this.props.currentDeal.user1Asset.isConfirmed &&
            this.props.currentDeal.user2Asset.isConfirmed &&
            !this.props.currentDeal.isConfirmed ? (
              <Button onClick={() => this.confirmDeal()}>Confirm</Button>
            ) : ('')
          }
        </Confirms>
      </Wrapper>
    )
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({
  user: state.user,
  currentDeal: state.currentDeal,
  web3: state.ethereumWeb3.web3,
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
  bindActionCreators(
    {
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(ParcelSelector)

