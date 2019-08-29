import React, { Component } from 'react'
import { RouterState, Push, push } from 'connected-react-router';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';
import User from '../../../models/user.model';
import { match, Switch, Route } from 'react-router';
import PersonalInfoUpdateForm from './update-form';
import UserBasicInfo from './basic-info';
import { readUser } from '../../../services/user.service';
import { Link } from 'react-router-dom';
import ParcelList from './parcel-list';
import AuctionsList from './auctions-list';
import bind from 'bind-decorator';

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
	isLoading: boolean
	isOwner: boolean
	results?: User
}

class PersonalInfo extends Component<Props, State> {

	_isMounted = false
	state: State = {
		isLoading: false,
		isOwner: false,
		results: undefined,
	}

	public componentDidMount() {
		this._isMounted = true
		this.onRouteChange()
	}

	public componentWillUpdate(oldProps: Props) {
		if (oldProps.router.location.pathname !== this.props.router.location.pathname) {
			this.onRouteChange()
		}
	}

	public componentWillUnmount() {
		this._isMounted = false
	}

	private async onRouteChange() {
		this.setState({ isLoading: true, isOwner: false })
		const results = await readUser(this.props.match.params.userId)
		if (!results && this._isMounted) {
			this.setState({
				results: undefined,
				isLoading: false,
				isOwner: false
			})
			return
		}

		if (this._isMounted) {
			this.setState({
				results,
				isLoading: false,
				isOwner: this.props.user.address === this.props.match.params.userId
			})
		}
	}

	@bind
	private async beginConversation() {
		if (this.state.results)
			this.props.push(`/main/messages/new/${this.state.results.address}`)
	}

	render() {
		const user = this.state.results
		return (
			<div>
				{
					this.state.isLoading ? (
						'Loading...'
					) : user === undefined ? (
						'Error loading user'
					) : (
								<div>
									{
										this.state.isOwner ? (
											<PersonalInfoUpdateForm user={user} />
										) : (
												<div>
													<UserBasicInfo user={user} />
													<button onClick={this.beginConversation}>Begin conversation</button>
												</div>
											)
									}
									<div>
										<Link to={`/main/users/${this.props.match.params.userId}/parcels`}>Parcels</Link>
										<Link to={`/main/users/${this.props.match.params.userId}/auctions`}>Auctions</Link>
										<Link to={`/main/users/${this.props.match.params.userId}/ads`}>Ads</Link>
										{
											this.state.isOwner ? (
												<Link to={`/main/users/${this.props.match.params.userId}/deals`}>Deals</Link>
											) : ('')
										}
									</div>
									<Switch>
										<Route path="/main/users/:userId/parcels"
											render={props => <ParcelList {...props} parcels={user.parcels} />}
										/>
										<Route path="/main/users/:userId/auctions"
											render={props =>
												<AuctionsList {...props}
													auctions={user.auctions}
													isOwner={this.state.isOwner}
													parcels={user.parcels}
												/>
											}
										/>
									</Switch>
								</div>
							)
				}
			</div>
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
		dispatch
	)

export default connect(mapStateToProps, mapDispatchToProps)(PersonalInfo)