import React, { Component, FormEvent } from 'react'
import User from '../../../models/user.model';
import bind from 'bind-decorator';
import { formDataToJson } from '../../../helper';
import { updateUser } from '../../../services/user.service';

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
    private async handleSubmit (reactEvent: FormEvent<HTMLFormElement>) {
        const event = reactEvent.nativeEvent as Event
        event.preventDefault()
        const target = event.target as HTMLFormElement
        const formData = new FormData(target)
        const obj = formDataToJson<User>(formData)
        obj.address = this.state.address
        await updateUser(obj)
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input name="firstName" defaultValue={this.state.firstName} required/>
                <input name="lastName" defaultValue={this.state.lastName} required/>
                <input name="location" defaultValue={this.state.location} required/>
                <button>Save</button>
            </form>
        )
    }
}

export default PersonalInfoUpdateForm