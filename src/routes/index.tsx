import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router'
import Main from '../components/pages/Main'
import Register from '../components/pages/Register'
import InstallMetamask from '../components/pages/InstallMetamask'
import WrongNetwork from '../components/pages/WrongNetwork'
import ConfirmConnection from '../components/pages/ConfirmConnection'
import AdminPage from '../components/pages/AdminPage'

class Routes extends Component {
    render() {
        return (
            <Switch>
                <Redirect exact from="/" to="/main"/>
                <Route path="/main" component={Main} />
                <Route path="/register" component={Register} />
                <Route path="/install-metamask" component={InstallMetamask} />
                <Route path="/wrong-network" component={WrongNetwork} />
                <Route path="/no-connection" component={ConfirmConnection} />
                <Route path="/admin" component={AdminPage} />
            </Switch>
        )
    }
}

export default Routes