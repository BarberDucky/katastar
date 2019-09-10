import React, { Component } from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { AppState } from '../../../store'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction, bindActionCreators } from 'redux'
import { push } from 'connected-react-router'
import * as Pages from './explorer-entities'
import MagGlas from '../../../assets/search-file.png'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 2em;
`

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  margin: 1em 0 4em 0;
`

const TitleImage = styled.div`
	display: flex;
	align-items: center;
	> * {
		margin-right: 2em;
	}
`

const Title = styled.h2`
  margin: 0;
`

const Menu = styled.div`
	margin-left: 3em;
  display: flex;
  height: 100%;
	align-items: center;
`

const MenuItem = styled(Link)`
  height: 2em;
  width: 6em;
  padding: 10px 10px 10px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: black;
  &:hover {
    cursor: pointer;
    background-color: blue;
    color: white;
  }
`

interface Props {
	pathname: string
	push: typeof push
}

class Explorer extends Component<Props> {
	render() {
		return (
			<Container>
				<Header>
					<TitleImage>
						<img src={MagGlas} alt="explorer" height='64' />
						<Title>Explore</Title>
					</TitleImage>
					<Menu>
						<MenuItem to="/main/explorer/parcels">Parcels</MenuItem>
						<MenuItem to="/main/explorer/users">Users</MenuItem>
						<MenuItem to="/main/explorer/auctions">Auctions</MenuItem>
					</Menu>
				</Header>
				<Switch>
					<Route path={'/main/explorer/auctions'} component={Pages.auctions} />
					<Route path={'/main/explorer/parcels'} component={Pages.parcels} />
					<Route path={'/main/explorer/users'} component={Pages.users} />
				</Switch>
			</Container>
		)
	}
}

const mapStateToProps = (state: AppState) => ({
	pathname: state.router.location.pathname,
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
	bindActionCreators(
		{
			push,
		},
		dispatch
	)

export default connect(mapStateToProps, mapDispatchToProps)(Explorer)