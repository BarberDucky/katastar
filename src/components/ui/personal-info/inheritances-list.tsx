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

interface StateProps {
  router: RouterState
  user: User
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
}

class InheritancesList extends Component<Props, State> {

  state: State = {
    users: []
  }

  @bind
  private openDetails(inheritance: Inheritance) {
    this.props.push(`/main/inheritances/${inheritance.address}`)
  }

  @bind
  private async loadUsers() {
    const users = await searchUsers({})
    this.setState({users})
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
      ...obj
    }
    await createInheritance(obj)
  }

  render() {
    return (
      <div>
        {
          this.props.isOwner ? (
            <div>
              <span>Create new Inheritance</span>
              <form onSubmit={this.handleSubmit}>
                <input name="deadline" required />
                <select name="parcel" required>
                  {
                    this.props.parcels.map(parcel => {
                      return (
                        <option
                          value={parcel.address}
                          key={`inheritanceParcel${parcel.address}`}
                        >
                          {parcel.address}
                        </option>
                      )
                    })
                  }
                </select>
                <select name="to" onClick={this.loadUsers} required>
                  {
                    this.state.users.map(user => {
                      return (
                        <option
                          value={user.address}
                          key={`inheritanceUser${user.address}`}
                        >
                          {user.address}
                        </option>
                      )
                    })
                  }
                </select>
                <button>Create New Inheritance Contract</button>
              </form>
            </div>
          ) : (
              ''
            )
        }
        {
          this.props.inheritances.length === 0 ? (
            'User has no inheritance.'
          ) : (
              <table>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Deadline</th>
                    <th>Number of Parcels</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.props.inheritances.map(inheritance => {
                      return (
                        <tr key={`userInheritance${inheritance.address}`}>
                          <td>{inheritance.address}</td>
                          <td>{inheritance.from}</td>
                          <td>{inheritance.to}</td>
                          <td>{inheritance.deadline}</td>
                          <td>{inheritance.parcel}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            )
        }
      </div>
    )
  }
}


const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({
  router: state.router,
  user: state.user
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
  bindActionCreators(
    {
      push,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(InheritancesList)