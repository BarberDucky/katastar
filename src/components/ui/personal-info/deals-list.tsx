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
import Web3 from 'web3'
import styled from 'styled-components';
import DealImg from '../../../assets/diploma.png'
import { Table } from 'semantic-ui-react';

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	margin-left: 1em;
	display: flex;
	flex-direction: column;
`
const TitleImage = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 1em;
	> * {
		margin-right: 2em;
	}
`

const Title = styled.h3`
    margin: 0;
`

interface StateProps {
  router: RouterState
  user: User
  web3: Web3 | null
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
    if (this.props.web3) {
      withdrawDeal(deal, this.props.user.address, this.props.web3)
    } else {
      alert('no web3')
    }
  }


  render() {
    return (
      <Wrapper>
        <TitleImage>
					<img src={DealImg} alt="explorer" height='64'/>
					<Title>Deals</Title>
				</TitleImage>
        {
          this.props.deals.length === 0 ? (
            'User has made no deals.'
          ) : (
              <Table striped selectable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>User 1</Table.HeaderCell>
                    <Table.HeaderCell>User 1 Eth</Table.HeaderCell>
                    <Table.HeaderCell>User 1 Parcel</Table.HeaderCell>
                    <Table.HeaderCell>User 2</Table.HeaderCell>
                    <Table.HeaderCell>User 2 Eth</Table.HeaderCell>
                    <Table.HeaderCell>User 2 Parcel</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    this.props.deals.map(deal => {
                      return (
                        <Table.Row key={`userDeals${deal.address}`}
                          onClick={() => this.openDetails(deal)}
                        >
                          <Table.Cell>{deal.user1Asset.userAddress}</Table.Cell>
                          <Table.Cell>{deal.user1Asset.eth}</Table.Cell>
                          <Table.Cell>{deal.user1Asset.parcels.length}</Table.Cell>
                          <Table.Cell>{deal.user2Asset.userAddress}</Table.Cell>
                          <Table.Cell>{deal.user2Asset.eth}</Table.Cell>
                          <Table.Cell>{deal.user2Asset.parcels.length}</Table.Cell>
                        </Table.Row>
                      )
                    })
                  }
                </Table.Body>
              </Table>
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
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(DealsList)