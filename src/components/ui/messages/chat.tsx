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
import { Message } from '../../../models/conversation.model';

interface StateProps {
	router: RouterState
	currentUser: User
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
	results: Message[],
	conversationId: string
}

class Chat extends Component<Props, State> {

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

	public componentWillUnmount() {
		this._isMounted = false
	}

	private async onRouteChange() {
		this.setState({ isLoading: true })
		const conversation = await readConversationFromId(
			this.props.currentUser.address,
			this.props.match.params.userId,
		)
		
		let results: Message[] = []
		let conversationId = ''
		if (conversation) {
			results = Object.values(conversation.messages)
			conversationId = conversation.address
		}


		if (this._isMounted)
			this.setState({ results, isLoading: false, conversationId })
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
		pushMessage(obj, this.state.conversationId)
	}

	render() {
		return (
			<div>
				{
					this.state.isLoading ? (
						'Loading...'
					) : (
							<div>
								{
									this.state.results.map((result, index) => {
										return (
											<div key={`chat${index}`}>
												{result.content}
											</div>
										)
									})
								}
							</div>
						)
				}

				<form onSubmit={ev => this.sendMessage(ev)}>
					<input
						name="content"
						placeholder="Type message..."
					/>
					<button> --> </button>
				</form>
			</div>
		)
	}
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({
	router: state.router,
	currentUser: state.user
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
	bindActionCreators(
		{
			push,
		},
		dispatch,
	)

export default connect(mapStateToProps, mapDispatchToProps)(Chat)