import React, { Component } from 'react'
import { RouterState, Push, push } from 'connected-react-router';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';
import { match } from 'react-router';
import bind from 'bind-decorator';
import { Loader, Button } from 'semantic-ui-react';
import User from '../../../models/user.model';
import { readUser } from '../../../services/user.service';
import styled from 'styled-components';
import { createDeal } from '../../../services/deal.service';
import Deal from '../../../models/deal.model';

const Wrapper = styled.div`
	height: 100%;
	width: 40%;
`

const UserName = styled.div`
	&:hover {
		cursor: pointer;
	}
`

const InfoAndButton = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	padding: 2em;
`

const InfoAndParcel = styled.div`
	flex-grow: 2;
`

const ParcelId = styled.div`
	&:hover {
		cursor: pointer;
	}
`

interface StateProps {
	router: RouterState
	user: User
}

interface DispatchProps {
	push: Push
}

interface ParamProps {
	userId: string
}

interface OwnProps {
	match: match<ParamProps>
}

type Props = StateProps & DispatchProps & OwnProps

interface State {
	isLoading: boolean,
	results?: User
}

class UserInfo extends Component<Props, State> {

	state: State = {
		isLoading: true,
		results: undefined
	}

	_isMounted = false

	public async componentDidMount() {
		this._isMounted = true
		this.onRouteChange()
	}

	public componentDidUpdate(oldProps: Props) {
		if (oldProps.router.location.pathname !== this.props.router.location.pathname) {
			this.onRouteChange()
		}
	}

	public componentWillUnmount() {
		this._isMounted = false
	}

	private async onRouteChange() {
		this.setState({ isLoading: true })

		const results: User = await readUser(this.props.match.params.userId)

		if (!results) {
			this.props.push(`/main/messages`)
			return
		}

		if (this._isMounted)
			this.setState({ results, isLoading: false })
	}

	@bind
	private selectParcel(parcelId: string) {
		this.props.push(`/main/parcels/${parcelId}`)
	}

	@bind
	private selectUser(userId: string) {
		this.props.push(`/users/${userId}`)
	}

	@bind
	private async makeADeal() {
		const deal: Deal = {
			id: '',
			address: '',
			isConfirmed: false,
			isWithdrawn: false,
			isCompleted: false,
			user1Asset: {
				userAddress:	this.props.user.address,
				isConfirmed: false,
				isPayed: false,
				eth: 0,
				parcels: '',
			},
			user2Asset: {
				userAddress:	this.props.match.params.userId,
				isConfirmed: false,
				isPayed: false,
				eth: 0,
				parcels: '',
			},
		}
		const dealId = await createDeal(deal)
		this.props.push(`/main/deals/${dealId}`)
	}

	render() {
		return (
			<Wrapper>
				{
					this.state.isLoading ? (
						<Loader active />
					) : this.state.results === undefined ? (
						'Select a message to see user details.'
					) : (
						<InfoAndButton>
							<InfoAndParcel>
								<UserName
									onClick={() => this.selectUser(this.state.results ? this.state.results.address : '')}
								>
									<span>{`${this.state.results.firstName} ${this.state.results.lastName}`}</span>
								</UserName>
								{
									this.state.results.parcels.length !== 0 ? (
										<div>
											Owned Parcels:
											{
												this.state.results.parcels.map(parcel => {
													return (
														<ParcelId
															key={`userParcel${parcel.address}`}
															onClick={() => this.selectParcel(parcel.address)}
														>
															<span>{parcel.address}</span>
														</ParcelId>
													)
												})
											}
										</div>
									) : (
										'User has no parcels.'
									)
								}
							</InfoAndParcel>
							<Button secondary onClick={() => this.makeADeal()}>Make a Deal</Button>
						</InfoAndButton>
					)
				}
			</Wrapper>
		)
	}
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({
	router: state.router,
	user: state.user,
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
	bindActionCreators(
		{
			push,
		},
		dispatch,
	)

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo)