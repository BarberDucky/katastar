import React, { Component } from 'react'
import { createUser } from '../../services/user.service';
import User from '../../models/user.model';
import { connect } from 'react-redux';
import { push } from 'connected-react-router'
import { loadUser } from '../../store/user/actions';

declare let window: any;

interface RegisterProps {
	push: typeof push,
	loadUser: typeof loadUser,
	user: User
}

class Register extends Component<RegisterProps> {

    async handleSubmit(event: any) {
        event.preventDefault()
        const user: User = {
            address: window.ethereum.selectedAddress,
            firstName: event.target.firstName.value,
            lastName: event.target.lastName.value,
            location: event.target.location.value
        }

        await createUser(user)
        this.props.push('/')
    }

    render() {

        const address = window.ethereum.selectedAddress

        return (
            <div>
                <form onSubmit={(ev) => this.handleSubmit(ev)}>
                    <span>Address {address}</span> 
                    <br/>
                    <label>
                        <span>First Name</span>
                        <input name="firstName" required/>
                    </label>
                    <br/>
                    <label>
                        <span>Last Name</span>
                        <input name="lastName" required/>
                    </label>
                    <br/>
                    <label>
                        <span>Location</span>
                        <input name="location" required/>
                    </label>
                    <br/>
                    <button>Submit</button>
                </form>
            </div>
        )
    }
}

export default connect(null, { push })(Register)