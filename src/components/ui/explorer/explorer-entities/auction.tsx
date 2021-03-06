import React, { Component, FormEvent } from 'react'
import bind from 'bind-decorator'
import { formDataToJson as formDataToObject, generateIdenticon } from '../../../../helper'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction, bindActionCreators } from 'redux'
import { connect, MapStateToProps } from 'react-redux'
import { Push, push, RouterState } from 'connected-react-router'
import qs from 'qs'
import styled from 'styled-components'
import { AppState } from '../../../../store'
import { searchAuctions } from '../../../../services/auction.service'
import Auction from '../../../../models/auction.model'
import { Input, Button, Table, Loader, Image } from 'semantic-ui-react'
import AuctionImg from '../../../../assets/currency-exchange.png'

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

export interface AuctionFormData {
	address: string
	owner: string
	region: string
	municipality: string
	cadastreMunicipality: string
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
	results: Auction[]
}

class AuctionPageComponent extends Component<Props, State> {

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
		const obj = formDataToObject<any>(formData)
		const queryString = qs.stringify(obj)
		const pathName = this.props.router.location.pathname
		this.props.push(pathName + '?' + queryString)
	}

	private async onRouteChange() {
		const params = qs.parse(this.props.router.location.search.slice(1)) as AuctionFormData
		this.setState({ isLoading: true })

		const results = await searchAuctions(params)

		if (this._isMounted)
			this.setState({ results, isLoading: false })
	}

	private openDetails(item: Auction) {
		// const currentPath = this.props.router.location.pathname
		this.props.push(`/main/auctions/${item.address}`)
	}

	render() {
		return (
			<Wrapper>
				<Form onSubmit={this.handleSubmit}>
					<TitleImage>
							<img src={AuctionImg} alt="explorer" height='64'/>
							<Title>Auctions</Title>
					</TitleImage>
					<Label>
						<span>Address</span>
						<Input type="text" name="address" placeholder="eg. 0x1bC23..."/>
					</Label>
					<Label>
						<span>Owner</span>
						<Input type="text" name="owner" placeholder="eg. 0x1bC23..."/>
					</Label>
					<Label>
						<span>Region</span>
						<Input type="text" name="region" placeholder="eg. East Serbia"/>
					</Label>
					<Label>
						<span>Municipality</span>
						<Input type="text" name="municipality" placeholder="eg. Niš"/>
					</Label>
					<Label>
						<span>Cadaste Municipality</span>
						<Input type="text" name="cadastreMunicipality" placeholder="eg. Brzi Brod"/>
					</Label>
					<StyledButton>
						<Button type="submit" primary>
							Search
						</Button>
					</StyledButton>
				</Form>
				<main>
					{
						this.state.isLoading ? (
							<Loader active />
						) : this.state.results.length === 0 ? (
							`No results.`
						) : (
									<Table striped selectable>
										<Table.Header>
											<Table.Row>
												<Table.HeaderCell>Auction Id</Table.HeaderCell>
												<Table.HeaderCell>Owner</Table.HeaderCell>
												<Table.HeaderCell>Deadline</Table.HeaderCell>
												<Table.HeaderCell>Parcel Id</Table.HeaderCell>
												<Table.HeaderCell>Parcel Region</Table.HeaderCell>
												<Table.HeaderCell>Parcel Municipality</Table.HeaderCell>
												<Table.HeaderCell>Parcel Cadaste Municipality</Table.HeaderCell>
											</Table.Row>
										</Table.Header>
										<Table.Body>
											{
												this.state.results.map(result => {
													return (
														<Table.Row key={result.address} onClick={() => this.openDetails(result)}>
															<Table.Cell>
																<Image src={generateIdenticon(result.address)} size='mini'/>
															</Table.Cell>
															<Table.Cell>{result.owner}</Table.Cell>
															<Table.Cell>{(new Date(result.deadline)).toLocaleString()}</Table.Cell>
															<Table.Cell>{result.parcel.address}</Table.Cell>
															<Table.Cell>{result.parcel.region}</Table.Cell>
															<Table.Cell>{result.parcel.municipality}</Table.Cell>
															<Table.Cell>{result.parcel.cadastreMunicipality}</Table.Cell>
														</Table.Row>
													)
												})
											}
										</Table.Body>
									</Table>
								)
					}
				</main>
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

export default connect(mapStateToProps, mapDispatchToProps)(AuctionPageComponent)
