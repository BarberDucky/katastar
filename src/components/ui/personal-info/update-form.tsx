import React, { Component, FormEvent } from 'react'
import User from '../../../models/user.model';
import bind from 'bind-decorator';
import { formDataToJson, generateIdenticon } from '../../../helper';
import { updateUser } from '../../../services/user.service';
import { Card, Input, Button, Image } from 'semantic-ui-react';

interface Props {
	user?: User
}

interface State {
	address: string
	firstName: string
	lastName: string
	location: string
}

class PersonalInfoUpdateForm extends Component<Props, State> {

	state: State = {
		address: this.props.user ? this.props.user.address : '',
		firstName: this.props.user ? this.props.user.firstName : '',
		lastName: this.props.user ? this.props.user.lastName : '',
		location: this.props.user ? this.props.user.location : '',
	}

	@bind
	private async handleSubmit(reactEvent: FormEvent<HTMLFormElement>) {
		const event = reactEvent.nativeEvent as Event
		event.preventDefault()
		const target = event.target as HTMLFormElement
		const formData = new FormData(target)
		const obj = formDataToJson<User>(formData)
		obj.address = this.state.address

		await updateUser(obj)
		
	}

	render() {
		const result = this.props.user ? (
			<Card >
				<Card.Content>
				<Image src={generateIdenticon(this.props.user.address)} size='mini' floated='right'/>
					<Card.Header>{`${this.props.user.firstName} ${this.props.user.lastName}`}</Card.Header>
					<Card.Meta>User Description</Card.Meta>
					<Card.Description>
						<form onSubmit={this.handleSubmit}>
							<Input name="firstName" defaultValue={this.state.firstName} placeholder="eg. John" required />
							<Input name="lastName" defaultValue={this.state.lastName} placeholder="eg. Doe" required />
							<Input name="location" defaultValue={this.state.location} placeholder="eg. Niš" required />
							<Button primary>Save</Button>
						</form>	
					</Card.Description>
				</Card.Content>
			</Card>
		) : ('Error loading user.')

		return result
	}
}

export default PersonalInfoUpdateForm