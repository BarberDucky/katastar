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
import { loadEthereumProvider, loadWeb3 } from './store/ethereum/actions'
import { ThunkDispatch } from 'redux-thunk';
import Web3 from 'web3'

declare global {
	interface Window { 
		ethereum: any,
		web3: Web3
	}
}

interface AppProps {
	push: typeof push,
	loadUserAndRoute: typeof loadUserAndRoute,
	loadEthereumProvider: typeof loadEthereumProvider,
	loadWeb3: typeof loadWeb3,
	user: User,
	ethereum: any,
	web3: Web3 | null
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
		this.props.loadEthereumProvider(window.ethereum)
		this.props.loadWeb3(new Web3(this.props.ethereum))


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
	user: state.user,
	ethereum: state.ethereumWeb3.ethereum,
	web3: state.ethereumWeb3.web3
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
	bindActionCreators(
		{
			push,
			loadUserAndRoute,
			loadEthereumProvider,
			loadWeb3
		},
		dispatch
	)

export default connect(mapStateToProps, mapDispatchToProps)(App)
