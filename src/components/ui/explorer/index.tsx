import React, { Component } from 'react'
import { Link, Route, Switch } from 'react-router-dom';
import styled from 'styled-components'
import { AppState } from '../../../store';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import * as Pages from './explorer-entities'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
`

const Header = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-sizing: border-box;
`
const Title = styled.h2`
    margin-right: 20px;
` 

const Menu = styled.div`
    display: flex;
    height: 100%;
`

const MenuItem = styled(Link)`
    height: 100%;
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
    pathname: string,
    push: typeof push,
}

class Explorer extends Component<Props> {
    render() {
        return (
            <Container>
                <Header>
                    <Title>Explore</Title>
                    <Menu>
                        <MenuItem to="/main/explorer/parcels">Parcels</MenuItem>
                        <MenuItem to="/main/explorer/users">Users</MenuItem>
                        <MenuItem to="/main/explorer/auctions">Auctions</MenuItem>
                        {/*<MenuItem to="/main/explorer/ads">Ads</MenuItem>*/}
                    </Menu>
                </Header>
                <Switch>
                    <Route path={'/main/explorer/auctions'} component={Pages.auctions}/>
                    <Route path={'/main/explorer/parcels'} component={Pages.parcels}/>
                    <Route path={'/main/explorer/users'} component={Pages.users}/>
                    {/*<Route path={'/main/explorer/ads'} component={Pages.ads}/>*/}
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