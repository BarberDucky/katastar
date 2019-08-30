import React, { Component } from 'react'
import User from '../../../models/user.model';
import { Card, Image, Button } from 'semantic-ui-react';
import { generateIdenticon } from '../../../helper';

interface Props {
	user?: User
	beginCoversation: () => void
}

class UserBasicInfo extends Component<Props> {
	render() {
		const user = this.props.user
		let result = (<div>User not loaded.</div>)
		if (user) {
			result = (
				<Card >
					<Card.Content>
						<Image src={generateIdenticon(user.address)} size='mini' floated='right' />
						<Card.Header>{`${user.firstName} ${user.lastName}`}</Card.Header>
						<Card.Meta>User Description</Card.Meta>
						<Card.Description>
							<span>{`Location: ${user.location}`}</span>
						</Card.Description>
					</Card.Content>
					<Card.Content extra>
						
					<Button onClick={this.props.beginCoversation}>Begin conversation</Button>

					</Card.Content>
				</Card>
			)
		}

		return result
	}
}

export default UserBasicInfo