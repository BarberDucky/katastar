import React, { Component, FormEvent } from 'react'
import { RouterState, Push, push } from 'connected-react-router';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';
import { match } from 'react-router';
import { formDataToJson } from '../../../helper';
import bind from 'bind-decorator';
import { readConversationFromId, pushMessage } from '../../../services/conversation.service';
import User from '../../../models/user.model';
import Conversation, { Message } from '../../../models/conversation.model';
import { Loader, Button, Input } from 'semantic-ui-react';
import styled from 'styled-components';
import { fetchConversation, unsubscribeConversation } from '../../../thunks/conversation.thunk';

const Segment = styled.div`
	height: 100%;
	width: 100%;
	border-radius: 2px;
	border: lightgray 0.5px solid;
	padding: 2em;
	display: flex;
	flex-direction: column;
	align-items: stretch;
`

const Chat = styled.div`
	flex-grow: 2;
	display: flex;
	flex-direction: column;
	overflow-y: scroll;
	padding-bottom: 0.5em;
	box-sizing: border-box;

	> * + * {
		margin-top: 0.5em;
	}
`

const ChatEntry = styled.div`
	border: lightgray 0.5px solid;
	border-radius: 0.7em;
	padding: 5px;
	width: fit-content;
	background-color: ${(props: ChatEntryProps) => props.isOwner ? "blue" : "white"};
	color: ${(props: ChatEntryProps) => props.isOwner ? "white" : "black"};
	align-self: ${(props: ChatEntryProps) => props.isOwner ? "flex-end" : "flex-start"};
`

interface ChatEntryProps {
	isOwner: boolean
}

const Form = styled.form`
	
`

interface StateProps {
	router: RouterState
	currentUser: User
	currentConversation: Conversation
}

interface DispatchProps {
	push: Push
	fetchConversation: typeof fetchConversation
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
	results: Message[],
	conversationId: string
}

class ChatPage extends Component<Props, State> {

	state: State = {
		isLoading: true,
		results: [],
		conversationId: '',
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

	public async componentWillUnmount() {
		this._isMounted = false
		await unsubscribeConversation(this.props.currentConversation.address)
	}

	private async onRouteChange() {
		this.setState({ isLoading: true })
		
		console.log(this.props)

		this.props.fetchConversation(
			this.props.currentConversation.address,
			this.props.match.params.userId,
			this.props.currentUser.address,
		)

		if (this._isMounted)
			this.setState({ isLoading: false})
	}

	@bind
	private sendMessage(reactEvent: FormEvent<HTMLFormElement>) {
		const event = reactEvent.nativeEvent as Event
		event.preventDefault()
		const target = event.target as HTMLFormElement
		const formData = new FormData(target)
		let obj = formDataToJson<Message>(formData)
		obj = {
			fromUser: this.props.currentUser.address,
			toUser: this.props.match.params.userId,
			...obj,
		}
		pushMessage(obj, this.props.currentConversation.address)
	}

	render() {
		return (
			<Segment>
				{
					this.state.isLoading && !this.props.currentUser ? (
						<Loader active />
					) : (
							<Chat>
								{
									this.props.currentConversation.messages.map((result, index) => {
										return (
											<ChatEntry key={`chat${index}`} isOwner={result.fromUser === this.props.currentUser.address}>
												{result.content}
											</ChatEntry>
										)
									})
								}
							</Chat>
						)
				}

				<Form onSubmit={ev => this.sendMessage(ev)}>
					<Input
						name="content"
						placeholder="Type message..."
					/>
					<Button circular primary icon="paper plane outline" />
				</Form>
			</Segment>
		)
	}
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({
	router: state.router,
	currentUser: state.user,
	currentConversation: state.currentConversation,
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
	bindActionCreators(
		{
			push,
			fetchConversation,
		},
		dispatch,
	)

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage)