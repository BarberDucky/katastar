import React, { Component } from 'react'
import bind from 'bind-decorator'
import { FormEvent } from "react";
import { formDataToJson as formDataToObject } from "../../../../helper";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction, bindActionCreators } from "redux";
import { connect, MapStateToProps } from "react-redux";
import { Push, push, RouterState } from "connected-react-router";
import qs from 'qs'
import styled from 'styled-components';
import { AppState } from '../../../../store';
import { searchUsers } from '../../../../services/user.service';
import User from '../../../../models/user.model';
import { Input, Table, Button, Loader } from 'semantic-ui-react';
import UsersImg from '../../../../assets/network.png'

const Wrapper = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    > * + * {
        margin-top: 2em;
    }
`

const TitleImage = styled.div`
	display: flex;
	align-items: center;
	flex-grow: 2;
	> * {
		margin-right: 2em;
	}
`

const Title = styled.h3`
    margin: 0;
` 

const Form = styled.form`
    display: flex;
    > * + * {
        margin-left: 1em;
    }
`

const Label = styled.label`
    display: flex;
    flex-direction: column;
    > * + * {
        margin-top: 0.33em;
    }
`

const StyledButton = styled.div`
	align-self: flex-end;
	margin-bottom: 3px;
`

const Main = styled.main``

export interface UserFormData {
	address: string,
	firstName: string,
	lastName: string,
	location: string
}

interface StateProps {
	router: RouterState
}

interface DispatchProps {
	push: Push
}

interface OwnProps {

}

type Props = StateProps & DispatchProps & OwnProps

interface State {
	isLoading: boolean
	results: User[]
}

class UserPageComponent extends Component<Props, State> {

	_isMounted = false

	public state: State = {
		isLoading: false,
		results: [],
	}

	public componentDidMount() {
		this._isMounted = true
		this.onRouteChange()
	}

	public componentDidUpdate(oldProps: Props) {
		if (oldProps.router.location.search !== this.props.router.location.search) {
			this.onRouteChange()
		}
	}

	public componentWillUnmount() {
		this._isMounted = false
	}

	@bind
	private handleSubmit(reactEvent: FormEvent<HTMLFormElement>) {
		const event = reactEvent.nativeEvent as Event
		event.preventDefault()
		const target = event.target as HTMLFormElement
		const formData = new FormData(target)
		const obj = formDataToObject<UserFormData>(formData)
		const queryString = qs.stringify(obj)
		const pathName = this.props.router.location.pathname
		this.props.push(pathName + '?' + queryString)
	}

	private async onRouteChange() {
		const params = qs.parse(this.props.router.location.search.slice(1)) as UserFormData
		this.setState({ isLoading: true })
		const results = await searchUsers(params)

		if (this._isMounted)
			this.setState({ results, isLoading: false })
	}

	private openDetails(item: User) {
		// const currentPath = this.props.router.location.pathname
		this.props.push(`/main/users/${item.address}`)
	}

	render() {
		return (
			<Wrapper>
				<Form onSubmit={this.handleSubmit}>
					<TitleImage>
							<img src={UsersImg} alt="explorer" height='64'/>
							<Title>Users</Title>
					</TitleImage>
					<Label>
						<span>Address</span>
						<Input type="text" name="address" placeholder="eg. 0x1bC23..." />
					</Label>
					<Label>
						<span>First Name</span>
						<Input type="text" name="firstName" placeholder="eg. John" />
					</Label>
					<Label>
						<span>Last Name</span>
						<Input type="text" name="lastName" placeholder="eg. Doe" />
					</Label>
					<Label>
						<span>Location</span>
						<Input type="text" name="location" placeholder="eg. Niš" />
					</Label>
					<StyledButton>
						<Button type="submit" primary>
							Search
						</Button>
					</StyledButton>
				</Form>
				<Main>
					{
						this.state.isLoading ? (
							<Loader active />
						) : this.state.results.length === 0 ? (
							`No results.`
						) : (
									<Table striped selectable>
										<Table.Header>
											<Table.Row>
												<Table.HeaderCell>User Address</Table.HeaderCell>
												<Table.HeaderCell>First Name</Table.HeaderCell>
												<Table.HeaderCell>Last Name</Table.HeaderCell>
												<Table.HeaderCell>Location</Table.HeaderCell>
											</Table.Row>
										</Table.Header>
										<Table.Body>
											{
												this.state.results.map(result => {
													return (
														<Table.Row key={result.address} onClick={() => this.openDetails(result)}>
															<Table.Cell>{result.address}</Table.Cell>
															<Table.Cell>{result.firstName}</Table.Cell>
															<Table.Cell>{result.lastName}</Table.Cell>
															<Table.Cell>{result.location}</Table.Cell>
														</Table.Row>
													)
												})
											}
										</Table.Body>
									</Table>
								)
					}
				</Main>
			</Wrapper>
		)
	}

}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({
	router: state.router,
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
	bindActionCreators(
		{
			push,
		},
		dispatch,
	)

export default connect(mapStateToProps, mapDispatchToProps)(UserPageComponent)
