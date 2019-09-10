import React, { Component, FormEvent } from 'react'
import { RouterState, Push, push } from 'connected-react-router'
import { match } from 'react-router'
import { MapStateToProps, connect } from 'react-redux'
import { AppState } from '../../../store'
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux'
import bind from 'bind-decorator'
import Auction from '../../../models/auction.model'
import { readAuction, submitBid, readHighestBid, withdrawBids, endAuction, withdrawParcel } from '../../../services/auction.service'
import User from '../../../models/user.model'
import { formDataToJson } from '../../../helper'
import { Button, Loader, Segment, Input } from 'semantic-ui-react'
import Web3 from 'web3'
import styled from 'styled-components'
import AuctionImg from '../../../assets/currency-exchange.png'

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	padding: 2em;
  box-sizing: border-box;
	display: flex;
	flex-direction: column;
`

const TitleImage = styled.div`
	display: flex;
	align-items: center;
  margin-bottom: 2em;
	> * {
		margin-right: 2em;
	}
`

const Title = styled.h3`
  margin: 0;
`

const AuctionInfo = styled.div`
  display: flex;
  flex-direction: column;
  > * + * {
    margin-top: 1.5em;
  }
`

const TitleInfo = styled.h3` 
  margin-bottom: 2em;
`

const InfoEntry = styled.div`
  display: flex;
  flex-direction: column;

  > span:last-child {
    font-weight: bold;
    font-size: 1.2em;
  }
`

const SegmentWrapper = styled.div`
  padding: 2em;
  box-sizing: border-box;
`

const StyledSegment = styled(Segment)`
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: space-between;
`

const Label = styled.label`
  display: flex;
  flex-direction: column;
  > * + * {
    margin-top: 0.33em;
  }
`

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
}

class AuctionPage extends Component<Props, State> {
  _isMounted = false
  state: State = {
    isLoading: true,
    results: undefined,
    isOwner: false,
    highestBid: -1,
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

    let highestBid = -1

    if (this.props.web3) {
      highestBid = await readHighestBid(auction.address, this.props.web3)
    } else {
      alert('no web3')
    }
    
    if (this._isMounted) {
      this.setState({
        isLoading: false,
        results: auction,
        isOwner: auction ? this.props.user.address === auction.owner : false,
        highestBid,
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
    let deadline = 'error loading deadline'
    let highestBid = this.state.highestBid
    if(auction) {
      deadline = (new Date(auction.deadline)).toLocaleString()
      if (this.state.highestBid === auction.startingPrice) {
        highestBid = 0
      }
    }
    return (
      <Wrapper>
        <TitleImage>
          <img src={AuctionImg} alt="explorer" height='64' />
          <Title>Parcel Token</Title>
        </TitleImage>
        {
          this.state.isLoading ? (
            <Loader active />
          ) : !auction ? (
            'Error loading auction.'
          ) : (
            <SegmentWrapper>
              <StyledSegment>
              <AuctionInfo>
                <TitleInfo>Auction Info:</TitleInfo>
                <InfoEntry onClick={() => this.selectOwner(auction.owner)}>
                  <span>Auction Owner</span>
                  <span>{auction.owner}</span>
                </InfoEntry>
                <InfoEntry onClick={() => this.selectParcel(auction.parcel.address)}>
                  <span>Auctioned Parcel</span>
                  <span>{auction.parcel.address}</span>
                </InfoEntry>
                <InfoEntry>
                  <span>Estimated Deadline</span>
                  <span>{deadline}</span>
                </InfoEntry>
                <InfoEntry>
                  <span>Highest Bid</span>
                  <span>{highestBid}</span>
                </InfoEntry>
                <InfoEntry>
                  <span>Starting Price</span>
                  <span>{auction.startingPrice}</span>
                </InfoEntry>
                
              </AuctionInfo>

              <AuctionInfo>
              {
                !this.state.isOwner ? (
                  <div>
                    {
                      auction.deadline > Date.now() ? (
                        <form onSubmit={this.submitBid}>
                          <h4>Bid</h4>
                          <Label>
                            <span>Bid Amount</span>
                            <Input name='bid' placeholder='eg. 1000'/>
                          </Label>
                          <Button>Send Bid</Button>
                        </form>
                      ) : (
                        <div>
                          <Button onClick={() => this.withdrawBids()}>Withdraw Payed Bids</Button>
                          <Button onClick={() => this.withdrawWinner()}>Withdraw Won Parcel</Button>
                         </div> 
                      )
                    }
                  </div>
                ) :  auction.deadline <= Date.now() ? (
                  <Button onClick={() => this.endAuction()}>
                    {
                      highestBid === 0 ? (
                        'Withdraw Parcel'
                      ) : (
                        'Withdraw Eth'
                      )
                    }
                    
                  </Button>
                ) : (
                  'Auction is not over yet.'
                )
              }
              </AuctionInfo>
              
              </StyledSegment>
            </SegmentWrapper>
          )
        }
      </Wrapper>
    )
  }

}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({
  router: state.router,
  user: state.user,
  web3: state.ethereumWeb3.web3,
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
  bindActionCreators(
    {
      push,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(AuctionPage)