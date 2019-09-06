import React, { Component } from 'react'
import { RouterState, Push, push } from 'connected-react-router';
import { match } from 'react-router';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';
import bind from 'bind-decorator';import User from '../../../models/user.model';
import Inheritance from '../../../models/inheritance.model';
import { readInheritance, withdraw } from '../../../services/inheritance.service';
import Web3 from 'web3'
import { Button, Segment, Loader } from 'semantic-ui-react';
import styled from 'styled-components';
import InheritanceImg from '../../../assets/payment.png'

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

interface StateProps {
  router: RouterState
  user: User
  web3: Web3 | null
}

interface DispatchProps {
  push: Push
}

interface ParamProps {
  inheritanceId: string
}

interface OwnProps {
  match: match<ParamProps>
}

type Props = StateProps & DispatchProps & OwnProps

interface State {
  isOwner: boolean
  isLoading: boolean
  results?: Inheritance
  remainingTime: number
}

class InheritancePage extends Component<Props, State> {
  _isMounted = false
  state: State = {
    isLoading: true,
    results: undefined,
    isOwner: false,
    remainingTime: 1000
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
    const inheritance = await readInheritance(this.props.match.params.inheritanceId, this.props.user.address)

    let remainingTime = -1
    
    if (this._isMounted) {
      this.setState({
        isLoading: false,
        results: inheritance,
        isOwner: inheritance ? 
          this.props.user.address === inheritance.from ||
          this.props.user.address === inheritance.to
          : false,
        remainingTime
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
  async withdraw() {
    if (this.state.results && this.props.web3) {
      const result = await withdraw(
        this.state.results,
        this.props.web3,
        this.props.user.address,
        )
      if (result) {
        alert('inheritance withdrawn')
      } else {
        alert('could not withdraw')
      }
    } else {
      alert('no inheritance selected or no web3')
    }
  }

  render () {
    const inheritance = this.state.results
    let deadline = 'error loading deadline'
    if(inheritance) {
      deadline = (new Date(inheritance.deadline)).toLocaleString()
    }
    return (
      <Wrapper>
        <TitleImage>
          <img src={InheritanceImg} alt="explorer" height='64' />
          <Title>Parcel Token</Title>
        </TitleImage>
        {
          this.state.isLoading ? (
            <Loader active />
          ) : !inheritance ? (
            'Error loading auction.'
          ) : (
            <SegmentWrapper>
              <StyledSegment>
              <AuctionInfo>
                <TitleInfo>Inheritance Info:</TitleInfo>
                <InfoEntry onClick={() => this.selectOwner(inheritance.from)}>
                  <span>From</span>
                  <span>{inheritance.from}</span>
                </InfoEntry>
                <InfoEntry onClick={() => this.selectOwner(inheritance.to)}>
                  <span>To</span>
                  <span>{inheritance.to}</span>
                </InfoEntry>
                <InfoEntry onClick={() => this.selectParcel(inheritance.parcel)}>
                  <span>Inherited Parcel</span>
                  <span>{inheritance.parcel}</span>
                </InfoEntry>
                <InfoEntry>
                  <span>Estimated Deadline</span>
                  <span>{deadline}</span>
                </InfoEntry>
                <InfoEntry>
                  <span>Is Withdrawn</span>
                  {
                    inheritance.isWithdrawn ? (
                      <span>Yes</span>
                    ) : (
                      <span>No</span>
                    )
                  }
                </InfoEntry>
                
              </AuctionInfo>

              <AuctionInfo>
              {
                !inheritance.isWithdrawn ? (
                  <Button onClick={() => this.withdraw()} active={this.state.isOwner}>Withdraw</Button>
                ) : (
                  ''
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
  web3: state.ethereumWeb3.web3
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
  bindActionCreators(
    {
      push,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(InheritancePage)