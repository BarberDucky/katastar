import React, { Component, FormEvent } from 'react'
import { RouterState, Push, push } from 'connected-react-router';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { bindActionCreators, AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import Auction from '../../../models/auction.model';
import bind from 'bind-decorator';
import Parcel from '../../../models/parcel.model';
import { formDataToJson } from '../../../helper';
import User from '../../../models/user.model';
import { createAuction } from '../../../services/auction.service';
import Web3 from 'web3'
import styled from 'styled-components';
import AuctionImg from '../../../assets/currency-exchange.png'
import { Table, Input, Button, Select } from 'semantic-ui-react';

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
	margin-bottom: 2em;
	> * {
		margin-right: 2em;
	}
`

const Title = styled.h3`
    margin: 0;
`

const Form = styled.form`
	display: flex;
  > * + * {
    margin-left: 1em;
  }
`

const Label = styled.label`
    display: flex;
    flex-direction: column;
    > * + * {
        margin-top: 0.33em;
    }
`

const StyledButton = styled.div`
	align-self: flex-end;
	margin-bottom: 3px;
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
	auctions: Auction[]
	parcels: Parcel[]
}

type Props = StateProps & DispatchProps & OwnProps

interface State {

}

class AuctionsList extends Component<Props, State> {

	@bind
	private openDetails(auction: Auction) {
		this.props.push(`/main/auctions/${auction.address}`)
	}

	@bind
	private async handleSubmit(reactEvent: FormEvent<HTMLFormElement>) {
		const event = reactEvent.nativeEvent as Event
		event.preventDefault()
		const target = event.target as HTMLFormElement
		const formData = new FormData(target)
		const obj = formDataToJson<any>(formData)
		const auction: Auction = {
			isDone: false,
			address: '',
			owner: this.props.user.address,
			...obj
		}
		if (this.props.web3) {
			await createAuction(auction, obj.parcel, this.props.web3)
		} else {
			alert('no web3')
		}
	}

	render() {
		return (
			<Wrapper>
				<TitleImage>
					<img src={AuctionImg} alt="explorer" height='64' />
					<Title>Auctions</Title>
				</TitleImage>
				{
					this.props.isOwner ? (
						<div>
							<h4>Create new auction</h4>
							<Form onSubmit={this.handleSubmit}>
								<Label>
									<span>Starting Price</span>
									<Input name="startingPrice" type="number" min="0" placeholder="eg. 1000" required />
								</Label>
								<Label>
									<span>Duration (seconds)</span>
									<Input name="duration" type="number" min="0" placeholder="eg. 300" required />
								</Label>
								<Label>
									<span>Parcel</span>
									<Select name="parcel" required
										options={
											this.props.parcels.map(parcel => ({
													key: `auctionParcel${parcel.address}`,
													value: parcel.address,
													text: parcel.address,
											}))
										}
									/>
								</Label>
								<StyledButton>
									<Button>Create New Auction</Button>
								</StyledButton>
							</Form>
						</div>
					) : (
							''
						)
				}
				{
					this.props.auctions.length === 0 ? (
						'User has no auctions.'
					) : (
							<Table striped selectable>
								<Table.Header>
									<Table.Row>
										<Table.HeaderCell>Owner</Table.HeaderCell>
										<Table.HeaderCell>Parcel</Table.HeaderCell>
										<Table.HeaderCell>Deadline</Table.HeaderCell>
										<Table.HeaderCell>Starting Price</Table.HeaderCell>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{
										this.props.auctions.map(auction => {
											const deadline = new Date(auction.deadline)
											return (
												<Table.Row key={`userAuction${auction.address}`} onClick={() => this.openDetails(auction)}>
													<Table.Cell>{auction.owner}</Table.Cell>
													<Table.Cell>{auction.parcel.address}</Table.Cell>
													<Table.Cell>{deadline.toLocaleString()}</Table.Cell>
													<Table.Cell>{auction.startingPrice}</Table.Cell>
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
	web3: state.ethereumWeb3.web3
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
	bindActionCreators(
		{
			push,
		},
		dispatch
	)

export default connect(mapStateToProps, mapDispatchToProps)(AuctionsList)