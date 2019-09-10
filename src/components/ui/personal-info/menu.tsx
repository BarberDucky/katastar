import React, { Component } from 'react'
import { match } from 'react-router'
import { Menu } from 'semantic-ui-react'
import { Push, push, RouterState } from 'connected-react-router'
import { MapStateToProps, connect } from 'react-redux'
import { AppState } from '../../../store'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction, bindActionCreators } from 'redux'
import bind from 'bind-decorator'

interface Params {
  userId: string
}

interface StateProps {
  router: RouterState
}

interface DispatchProps {
  push: Push
}

interface OwnProps {
  isOwner: boolean
  match: match<Params>
}

type Props = StateProps & DispatchProps & OwnProps

class UserInfoMenu extends Component<Props> {

  @bind
  selectItem(path: string) {
    this.props.push(`/main/users/${this.props.match.params.userId}/${path}`)
  }

  getActiveItem() {
    const pathnameParams = this.props.router.location.pathname.split('/')
		const activeItem = pathnameParams[pathnameParams.length-1]
		return activeItem
  }

  render() {
    const activeItem = this.getActiveItem()
    return (
      <div>
        {
          this.props.isOwner ? (
            <Menu fluid vertical tabular>
              <Menu.Item onClick={() => this.selectItem('parcels')} active={activeItem === 'parcels'}>Parcels</Menu.Item>
              <Menu.Item onClick={() => this.selectItem('auctions')} active={activeItem === 'auctions'}>Auctions</Menu.Item>
              <Menu.Item onClick={() => this.selectItem('deals')} active={activeItem === 'deals'}>Deals</Menu.Item>
              <Menu.Item onClick={() => this.selectItem('inheritances')} active={activeItem === 'inheritances'}>Inheritances</Menu.Item>
            </Menu>
          ) : (
              <Menu fluid vertical tabular>
                <Menu.Item onClick={() => this.selectItem('parcels')} active={activeItem === 'parcels'}>Parcels</Menu.Item>
                <Menu.Item onClick={() => this.selectItem('auctions')} active={activeItem === 'auctions'}>Auctions</Menu.Item>
              </Menu>
            )
        }
      </div>
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


export default connect(mapStateToProps, mapDispatchToProps)(UserInfoMenu)