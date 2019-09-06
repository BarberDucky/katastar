import React, { Component, FormEvent } from 'react'
import { RouterState, Push, push } from 'connected-react-router';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { bindActionCreators, AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import bind from 'bind-decorator';
import Parcel from '../../../models/parcel.model';
import { formDataToJson } from '../../../helper';
import User from '../../../models/user.model';
import Inheritance from '../../../models/inheritance.model';
import { createInheritance } from '../../../services/inheritance.service';
import { searchUsers } from '../../../services/user.service';
import Web3 from 'web3'
import styled from 'styled-components';
import InheritanceImg from '../../../assets/payment.png'
import { Input, Select, Button, Table } from 'semantic-ui-react';

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	margin-left: 1em;
	display: flex;
	flex-direction: column;
`

const TitleImage = styled.div`
	display: flex;
	align-items: center;
  margin-bottom: 2em;
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

interface StateProps {
  router: RouterState
  user: User
  web3: Web3 | null
}

interface DispatchProps {
  push: Push
}

interface OwnProps {
  isOwner: boolean
  inheritances: Inheritance[]
  parcels: Parcel[]
}

type Props = StateProps & DispatchProps & OwnProps

interface State {
  users: User[]
  isLoading: boolean
}

class InheritancesList extends Component<Props, State> {

  _isMounted = false
  state: State = {
    users: [],
    isLoading: false
  }

  async componentDidMount() {
    this._isMounted = true
    this.onRouteChange()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  async onRouteChange() {
    this.setState({isLoading: true})

    const users = await searchUsers({})

    if(this._isMounted)
      this.setState({users, isLoading: false})
  }

  @bind
  private openDetails(inheritance: Inheritance) {
    this.props.push(`/main/inheritances/${inheritance.address}`)
  }

  @bind
  private async handleSubmit(reactEvent: FormEvent<HTMLFormElement>) {
    const event = reactEvent.nativeEvent as Event
    event.preventDefault()
    const target = event.target as HTMLFormElement
    const formData = new FormData(target)
    let obj = formDataToJson<Inheritance>(formData)
    obj = {
      from: this.props.user.address,
      address: '',
      isWithdrawn: false,
      ...obj
    }
    if (this.props.web3) {
      await createInheritance(obj, this.props.web3)
    } else {
      alert('no web3')
    }
  }

  render() {
    return (
      <Wrapper>
        <TitleImage>
          <img src={InheritanceImg} alt="explorer" height='64' />
          <Title>Inheritances</Title>
        </TitleImage>
        {
          this.props.isOwner ? (
            <div>
              <h4>Create new Inheritance</h4>
              <Form onSubmit={this.handleSubmit}>
                <Label>
                  <span>Duration (seconds)</span>
                  <Input name="duration" type="number" min="0" placeholder="eg. 300" required />
                </Label>
                <Label>
                  <span>Parcel</span>
                  <Select name="parcel" required
                    options={
                      this.props.parcels.map(parcel => ({
                        key: `inheritanceParcel${parcel.address}`,
                        value: parcel.address,
                        text: parcel.address,
                      }))
                    }
                  />
                </Label>
                <Label>
                  <span>To User</span>
                  <Select name="to" required loading={this.state.isLoading}
                    options={
                      this.state.users.map(user => ({
                        key: `inheritanceUser${user.address}`,
                        value: user.address,
                        text: `${user.firstName} ${user.lastName}, ${user.location}`,
                      }))
                    }
                  />
                </Label>
                <StyledButton>
									<Button>Create New Auction</Button>
								</StyledButton>
							</Form>
            </div>
          ) : (
              ''
            )
        }
        {
          this.props.inheritances.length === 0 ? (
            'User has no inheritance.'
          ) : (
              <Table striped selectable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>From</Table.HeaderCell>
                    <Table.HeaderCell>To</Table.HeaderCell>
                    <Table.HeaderCell>Deadline</Table.HeaderCell>
                    <Table.HeaderCell>Parcel</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    this.props.inheritances.map(inheritance => {
                      const deadline = new Date(inheritance.deadline)
                      return (
                        <Table.Row key={`userInheritance${inheritance.address}`}
                          onClick={() => this.openDetails(inheritance)}
                        >
                          <Table.Cell>{inheritance.from}</Table.Cell>
                          <Table.Cell>{inheritance.to}</Table.Cell>
                          <Table.Cell>{deadline.toLocaleString()}</Table.Cell>
                          <Table.Cell>{inheritance.parcel}</Table.Cell>
                        </Table.Row>
                      )
                    })
                  }
                </Table.Body>
              </Table>
            )
        }
      </Wrapper>
    )
  }
}


const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({
  router: state.router,
  user: state.user,
  web3: state.ethereumWeb3.web3,
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
  bindActionCreators(
    {
      push,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(InheritancesList)