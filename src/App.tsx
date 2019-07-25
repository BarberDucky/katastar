import React, { Component } from 'react'
import './App.css'
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators } from "redux";
import { push } from 'connected-react-router'
import { AppState } from './store';
import User from './models/user.model';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './store';
import Routes from './routes';
import { enableEthereum } from './services/ethereum.service';
import { loadUserAndRoute } from './thunks/auth';
import { ThunkDispatch } from 'redux-thunk';

declare global {
    interface Window { ethereum: any; }
}

interface AppProps {
	push: typeof push,
	loadUserAndRoute: typeof loadUserAndRoute,
	user: User
}

class App extends Component<AppProps> {

	async componentDidMount() {
		if (typeof window.ethereum === 'undefined') {
			alert('You need metamask to continue')
			this.props.push('/install-metamask')
			return
		}

		let connectionResult = await enableEthereum(window.ethereum)

		if (!connectionResult) {
			this.props.push('/no-connection')
			return
		}
	
		await this.props.loadUserAndRoute()
	}

	render() {
		return (
			<div className="App">
				<ConnectedRouter history={history}>
					<Routes />
				</ConnectedRouter>
			</div>
		)
	}
}

const mapStateToProps = (state: AppState) => ({
	user: state.user
})


  const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
  bindActionCreators(
    {
	  push,
	  loadUserAndRoute
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(App)
