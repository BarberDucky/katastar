import React, { Component } from 'react'
import { RouterState, Push, push } from 'connected-react-router'
import { MapStateToProps, connect } from 'react-redux'
import { AppState } from '../../../store'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction, bindActionCreators } from 'redux'
import User from '../../../models/user.model'
import { match, Switch, Route } from 'react-router'
import PersonalInfoUpdateForm from './update-form'
import UserBasicInfo from './basic-info'
import { readUser } from '../../../services/user.service'
import ParcelList from './parcel-list'
import AuctionsList from './auctions-list'
import bind from 'bind-decorator'
import InheritancesList from './inheritances-list'
import DealsList from './deals-list'
import styled from 'styled-components'
import UserImg from '../../../assets/cv.png'
import UserInfoMenu from './menu'
import { Loader } from 'semantic-ui-react'

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	padding: 2em;

	> * + * {
		margin-top: 2em;
	}
`

const TitleImage = styled.div`
	display: flex;
	align-items: center;
	> * {
		margin-right: 2em;
	}
`

const Title = styled.h2`
  margin: 0;
`

const Main = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
`

const InfoAndMenu = styled.div`
	display: flex;
	flex-direction: column;
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
		if ((!results || !results.address) && this._isMounted) {
			this.setState({
				results: undefined,
				isLoading: false,
				isOwner: false,
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
		const user = 
			this.state.results && 
			this.state.results.address === this.props.user.address ? 
			this.props.user : this.state.results
		
		return (
			<Wrapper>
				<TitleImage>
						<img src={UserImg} alt="explorer" height='64'/>
						<Title>User Info</Title>
				</TitleImage>
				{
					this.state.isLoading ? (
						<Loader active/>
					) : user === undefined ? (
						'This user has not registered yet.'
					) : (
								<Main>
									<InfoAndMenu>
										{
											this.state.isOwner ? (
												<PersonalInfoUpdateForm user={this.props.user} />
											) : (
													<div>
														<UserBasicInfo user={user} beginCoversation={this.beginConversation}/>
													</div>
												)
										}
										<UserInfoMenu match={this.props.match} isOwner={this.state.isOwner}/>			
									</InfoAndMenu>
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
										<Route 
											path="/main/users/:userId/inheritances" 
											render={props => 
												<InheritancesList {...props} 
													inheritances={user.inheritances} 
													isOwner={this.state.isOwner}
													parcels={user.parcels}
												/>
											}
										/>
										<Route 
											path="/main/users/:userId/deals" 
											render={props => 
												<DealsList {...props} 
													deals={user.deals} 
													isOwner={this.state.isOwner}
												/>
											}
										/>
									</Switch>
								</Main>
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
		dispatch
	)

export default connect(mapStateToProps, mapDispatchToProps)(PersonalInfo)