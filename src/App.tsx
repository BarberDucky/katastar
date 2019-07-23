import React, { Component } from 'react'
import './App.css'
import { connect } from 'react-redux';
import { push } from 'connected-react-router'
import { readUser } from './services/user.service';
import { loadUser } from './store/user/actions'
import { AppState } from './store';
import User from './models/user.model';
import { ConnectedRouter } from 'connected-react-router';
import InstallMetamask from './components/pages/InstallMetamask';
import WrongNetwork from './components/pages/WrongNetwork';
import Register from './components/pages/Register';
import { Switch, Route } from 'react-router-dom'
import { history } from './store';
import Main from './components/pages/Main';

declare let window: any
const desiredNetwork = '3'

interface AppProps {
	push: typeof push,
	loadUser: typeof loadUser,
	user: User
}

class App extends Component<AppProps> {

	async componentDidMount() {
		if (typeof window.ethereum === 'undefined') {
			alert('You need metamask to continue')
			this.props.push('/install-metamask')
			return
		}

		await window.ethereum.enable()
			.catch((reason: string) => {
				alert(reason)
			})

		const userFromDB = await readUser(window.ethereum.selectedAddress)

		if (window.ethereum.networkVersion !== desiredNetwork) {
			this.props.push('/wrong-network')
			return
		}

		if (!userFromDB) {
			this.props.push('/register')
		} else {
			this.props.loadUser(userFromDB)
			this.props.push('/')
		}
	}

	render() {
		return (
			<div className="App">
				<ConnectedRouter history={history}>
					<Switch>
						<Route exact path="/" component={Main} />
						<Route path="/register" component={Register} />
						<Route path="/install-metamask" component={InstallMetamask} />
						<Route path="/wrong-network" component={WrongNetwork} />
					</Switch>
				</ConnectedRouter>
			</div>
		)
	}
}

const mapStateToProps = (state: AppState) => ({
	user: state.user
})

export default connect(mapStateToProps, { push, loadUser })(App)
