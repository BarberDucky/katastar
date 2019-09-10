import React, { Component } from 'react'
import { MapStateToProps, connect } from 'react-redux'
import { AppState } from '../../../store'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction, bindActionCreators } from 'redux'
import { RouterState, Push, push } from 'connected-react-router'
import User, { ConversationInfo } from '../../../models/user.model'
import { Loader, Menu, Icon } from 'semantic-ui-react'
import { match } from 'react-router'
import bind from 'bind-decorator'

interface StateProps {
	router: RouterState
	user: User
}

interface DispatchProps {
	push: Push
}

interface OwnProps {
	match: match
}

type Props = StateProps & DispatchProps & OwnProps

interface State {
	isLoading: boolean
	results: ConversationInfo[]
	activeItem: string
}


class MessagesList extends Component<Props, State> {

	state: State = {
		isLoading: false,
		results: [],
		activeItem: '',
	}

	@bind
	private getActiveUser () {
		const pathnameParams = this.props.router.location.pathname.split('/')
		const activeUser = pathnameParams[pathnameParams.length-1]
		return activeUser
	}

	private openDetails(item: ConversationInfo) {
		this.props.push(`/main/messages/${item.fromId}`)
	}

	render() {
		const activeUser = this.getActiveUser()
		const conversations = this.props.user.conversations ? Object.values(this.props.user.conversations) : []
		return (
			<div>
				{
					this.state.isLoading ? (
						<Loader active />
					) : conversations.length === 0 ? (
						'No results...'
					) : (
								<Menu pointing vertical secondary>
									{
										conversations.sort((a, b) => b.date - a.date)
										.map(result => {
											return (
												<Menu.Item
													active={activeUser === result.fromId}
													key={`conversationinfo${result.conversationId}`}
													onClick={() => this.openDetails(result)}
												>
													<span>{result.fromName}</span>
													{!result.isRead &&  activeUser !== result.fromId? (<Icon name="bell outline" />) : ('')}
												</Menu.Item>
											)
										})
									}
								</Menu>
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
		dispatch,
	)

export default connect(mapStateToProps, mapDispatchToProps)(MessagesList)