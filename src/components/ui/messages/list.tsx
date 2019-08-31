import React, { Component } from "react";
import { MapStateToProps, connect } from "react-redux";
import { AppState } from "../../../store";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction, bindActionCreators } from "redux";
import { RouterState, Push, push } from "connected-react-router";
import styled from 'styled-components'
import User, { ConversationInfo } from "../../../models/user.model";
import { Loader, Menu, Icon } from "semantic-ui-react";

const Wrapper = styled.div`
	
`

interface StateProps {
	router: RouterState
	user: User
}

interface DispatchProps {
	push: Push
}

interface OwnProps {

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
		activeItem: ''
	}
	_isMounted = false

	public componentDidMount() {
		this._isMounted = true
	}

	public componentWillUnmount() {
		this._isMounted = false
	}

	private onRouteChange() {
		this.setState({ isLoading: true })
		const results = Object.values(this.props.user.conversations)
		if (this._isMounted)
			this.setState({ results, isLoading: false })
	}

	private openDetails(item: ConversationInfo) {
		this.setState({ activeItem: item.fromId })
		this.props.push(`/main/messages/${item.fromId}`)
	}

	render() {

		const conversations = this.props.user.conversations ? Object.values(this.props.user.conversations) : []
		return (
			<Wrapper>
				{
					this.state.isLoading ? (
						<Loader active />
					) : conversations.length === 0 ? (
						'No results...'
					) : (
								<Menu pointing vertical secondary>
									{
										conversations.map(result => {
											return (
												<Menu.Item
													active={this.state.activeItem === result.fromId}
													key={`conversationinfo${result.conversationId}`}
													onClick={() => this.openDetails(result)}
												>
													<span>{result.fromName}</span>
													{!result.isRead ? (<Icon name="bell outline" />) : ('')}
												</Menu.Item>
											)
										})
									}
								</Menu>
							)
				}
			</Wrapper>
		)
	}
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({
	router: state.router,
	user: state.user
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
	bindActionCreators(
		{
			push,
		},
		dispatch,
	)

export default connect(mapStateToProps, mapDispatchToProps)(MessagesList)