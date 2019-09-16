import React, { Component, ChangeEvent } from 'react'
import styled from 'styled-components'
import { Input, Button, Checkbox } from 'semantic-ui-react'
import User from '../../../models/user.model'
import Deal, { Asset } from '../../../models/deal.model'
import { MapStateToProps, connect } from 'react-redux'
import { AppState } from '../../../store'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction, bindActionCreators } from 'redux'
import bind from 'bind-decorator'
import Parcel from '../../../models/parcel.model'
import { updateDeal, putDealOnChain, payDeal, withdrawDeal } from '../../../services/deal.service'
import Web3 from 'web3'
import PatImg from '../../../assets/pat-coin-rich.png'
import EthImg from '../../../assets/eth.png'


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  > * + * {
    margin-top: 2em;
  }
`

const Ethereum = styled.div`
  display: flex;
`

const Confirms = styled.div`
  display: flex;
  flex-direction: column;
`

const ParcelsList = styled.div`
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
`

const ParcelItem = styled.div`
  display: flex;
  justify-content: space-between;
`

const Chooser = styled.div`
  display: flex;
  align-items: center;
  > * + * {
    margin-left: 1em;
  }
`

const StyledButton = styled.div`
  width: fit-content;
  margin-top: 2em;
`

const StyledSelect = styled.select`
	padding: .67857143em 1em;
	border: 1px solid rgba(34,36,38,.15);
	border-radius: .28571429rem;
	transition: box-shadow .1s ease, border-color .1s ease;
	line-height: 1.21428571em;
	font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
`

interface StateProps {
  user: User
  currentDeal: Deal
  web3: Web3 | null
}

interface OwnProps {
  isOwner: boolean
  assets: Asset
  userName: string
}

type Props = StateProps & OwnProps

class ParcelSelector extends Component<Props> {

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
  async changeParcel(ev: ChangeEvent<HTMLSelectElement>) {
    const parcelAddress = ev.target.value 
    let newDeal = this.props.currentDeal
    if (newDeal.user1Asset.userAddress === this.props.user.address) {
      newDeal.user1Asset.parcels = parcelAddress
    } else {
      newDeal.user2Asset.parcels = parcelAddress
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
    if (this.props.web3) {
      await payDeal(
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
        <h3>{`User ${this.props.userName} offers:`}</h3>
        {
          this.props.isOwner && !this.isConfirmed() ? (
            <Chooser>
              <span>Choose</span>
              <img src={PatImg} alt="parcel" height="32" />
              <StyledSelect onChange={(ev) => this.changeParcel(ev)}>
                <option
                  value={''}
                >
                  No parcel
                </option>
                { 
                  userParcels.map(parcel => {
                    return (
                      <option
                        key={`inheritanceParcel${parcel.address}`}
                        value={parcel.address}
                      >
                        {parcel.address}
                      </option>
                    )
                  })
                }
              </StyledSelect>
            </Chooser>
          ) : (
            <Chooser>
              <span>Choose</span>
              <img src={PatImg} alt="parcel" height="32" />
              <span>
              {
                assetParcel === '' ? 'No parcel' : assetParcel  
              }
              </span>
            </Chooser>
          ) 
        }
        
        <Ethereum>
        <Chooser>
          <span>Choose</span>
          <img src={EthImg} alt="ethereum" height="32" />
        
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
          </Chooser>
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
          <span>
            {
              this.props.currentDeal.isConfirmed &&
              this.props.assets.isPayed ? (
                'Assets payed'
              ) : (
                'Assets not payed'
              )
            }
          </span>
          <span>
            {
              this.props.currentDeal.isConfirmed &&
              this.props.currentDeal.isCompleted &&
              this.props.assets.isWithdrawn ? (
                'Assets withdrawn from other user'
              ) : (
                'Assets now withdrawn from other user'
              )
            }
          </span>
          {
            this.props.isOwner &&
            this.props.currentDeal.isConfirmed && 
            this.props.assets.isPayed &&
            (this.props.currentDeal.isCompleted &&
            !this.props.assets.isWithdrawn) ? (
              <StyledButton>
                <Button onClick={() => this.withdraw()}>Collect Assets</Button>
              </StyledButton>
            ) : ('')
          }
          {
            this.props.isOwner &&
            this.props.currentDeal.isConfirmed && 
            this.props.assets.isPayed &&
            !this.props.currentDeal.isCompleted ? (
              <StyledButton>
                <Button onClick={() => this.withdraw()}>Withdraw Payment</Button>
              </StyledButton>
            ) : ('')
          }
          {
            this.props.isOwner &&
            this.props.currentDeal.isConfirmed && 
            !this.props.assets.isPayed &&
            (!this.props.currentDeal.isCompleted ||
            !this.props.currentDeal.isWithdrawn) ? (
              <StyledButton>
                <Button onClick={() => this.pay()}>Pay</Button>
              </StyledButton>
            ) : ('')
          }
          {
            this.props.isOwner &&
            this.props.currentDeal.user1Asset.isConfirmed &&
            this.props.currentDeal.user2Asset.isConfirmed &&
            !this.props.currentDeal.isConfirmed ? (
              <StyledButton>
                <Button onClick={() => this.confirmDeal()}>Confirm</Button>
              </StyledButton>
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

