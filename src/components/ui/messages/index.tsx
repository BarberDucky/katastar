import React, { Component } from 'react'
import MessagesList from './list'
import { Route, Switch, match } from 'react-router'
import Chat from './chat';
import UserInfo from './user-info'
import NewConversation from './new-conversation'
import styled from 'styled-components'
import Envelope from '../../../assets/envelope.png'

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

const ListAndChat = styled.div`
	display: flex;
	height: 100%;
	width: 100%;

	> * + * {
		margin-left: 2em;
	}
`

const ChatAndInfo = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: space-between;

	> * + * {
		margin-left: 2em;
	}
`

interface Props {
	match: match
}

class Messages extends Component<Props> {
	render() {
		return (
			<Wrapper>
				<TitleImage>
					<img src={Envelope} alt="envelope" height='64'/>
					<Title>Messages</Title>
				</TitleImage>
				<ListAndChat>
					<MessagesList match={this.props.match}/>
					<Switch>
						<Route path="/main/messages/new/:userId" render={props => {
							return (
								<ChatAndInfo>
									<NewConversation {...props} />
									<UserInfo {...props} />
								</ChatAndInfo>
							)
						}} />
						<Route path="/main/messages/:userId" render={props => {
							return (
								<ChatAndInfo>
									<Chat {...props} />
									<UserInfo {...props} />
								</ChatAndInfo>
							)
						}} />
					</Switch>
				</ListAndChat>
			</Wrapper>
		)
	}
}

export default Messages