import React, { Component } from 'react'
import { createUser } from '../../services/user.service'
import User from '../../models/user.model'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { loadUser } from '../../store/user/actions'
import Web3 from 'web3'
import { Segment, Input, Button } from 'semantic-ui-react'
import styled from 'styled-components'
import PatImg from '../../assets/pat-coin-rich.png'
import { fetchUser } from '../../thunks/user.thunk'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction, bindActionCreators } from 'redux'

const Wrapper = styled.div`
	display: flex;
	height: 100%;
	width: 100%;
	background-color: cornflowerblue;
	justify-content: center;
	padding-top: 5em;
`

const StyledSegment = styled(Segment)`
	height: fit-content;
	padding: 2em;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	> * + * {
		margin-top: 1em;
	}
`

const TitleAndImage = styled.div`
	display: flex;
	align-items: center;
	> * {
		margin-right: 1em;
	}
`

const Title = styled.h1`
  margin: 0;
  margin-top: -5px;
`

const Address = styled.span`
	font-weight: bold;
	font-size: 1.2em;
`

const Form = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
`

interface RegisterProps {
	push: typeof push
	loadUser: typeof loadUser
	fetchUser: typeof fetchUser
	user: User
	web3: Web3
}

class Register extends Component<RegisterProps> {

	async handleSubmit(event: any) {
		event.preventDefault()
		const previousUserAddress = this.props.user ? this.props.user.address : ''
		const user: User = {
			address: window.ethereum.selectedAddress,
			firstName: event.target.firstName.value,
			lastName: event.target.lastName.value,
			location: event.target.location.value,
			parcels: [],
			auctions: [],
			conversations: [],
			inheritances: [],
			deals: [],
		}

		await createUser(user)
		await this.props.fetchUser(user.address, previousUserAddress)
		this.props.push('/')
	}

	render() {

		const address = window.ethereum.selectedAddress

		return (
			<Wrapper>
				<StyledSegment>
					<TitleAndImage>
						<img src={PatImg} alt='cadastre-logo' height='48' />
						<Title>Cadastre</Title>
					</TitleAndImage>
					<h2>Register</h2>
					<span>User Address</span>
					<Address>{address}</Address>
					<Form onSubmit={(ev) => this.handleSubmit(ev)}>
						<br />
						<label>
							<span>First Name</span>
							<Input name="firstName" placeholder="eg. John" required />
						</label>
						<br />
						<label>
							<span>Last Name</span>
							<Input name="lastName" placeholder="eg. Doe" required />
						</label>
						<br />
						<label>
							<span>Location</span>
							<Input name="location" placeholder="eg. Niš" required />
						</label>
						<br />
						<Button primary>Submit</Button>
					</Form>
				</StyledSegment>
			</Wrapper>
		)
	}
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
  bindActionCreators(
    {
      push,
      fetchUser,
    },
    dispatch,
  )


export default connect(null, mapDispatchToProps)(Register)