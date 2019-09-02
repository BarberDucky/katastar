import React, { Component } from 'react'
import './App.css'
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators } from "redux";
import { push, RouterState } from 'connected-react-router'
import { AppState } from './store';
import User from './models/user.model';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './store';
import Routes from './routes';
import { enableEthereum } from './services/ethereum.service';
import { loadUserAndRoute } from './thunks/auth.thunk';
import { loadEthereumProvider, loadWeb3 } from './store/ethereum/actions'
import { ThunkDispatch } from 'redux-thunk';
import Web3 from 'web3'
import 'semantic-ui-css/semantic.min.css'
import { Loader } from 'semantic-ui-react';

declare global {
	interface Window { 
		ethereum: any,
		web3: Web3
	}
}

interface State {
	isLoaded: boolean
}

interface Props {
	push: typeof push,
	loadUserAndRoute: typeof loadUserAndRoute,
	loadEthereumProvider: typeof loadEthereumProvider,
	loadWeb3: typeof loadWeb3,
	user: User,
	ethereum: any,
	web3: Web3 | null,
	router: RouterState
}

class App extends Component<Props, State> {

	state: State = {
		isLoaded: false
	}

	async componentDidMount() {
		this.setState({isLoaded: false})
		
		if (typeof window.ethereum === 'undefined') {
			alert('You need metamask to continue')
			this.props.push('/install-metamask')
			return
		}

		window.ethereum.autoRefreshOnNetworkChange = false
		let connectionResult = await enableEthereum(window.ethereum)

		if (!connectionResult) {
			this.props.push('/no-connection')
			return
		}

		const web3 = new Web3(window.web3.currentProvider)
		
		await this.props.loadUserAndRoute(this.props.router.location.pathname)

		this.props.loadEthereumProvider(window.ethereum)
		
		//const web3Provider = new Web3(this.props.ethereum)
		

		this.props.loadWeb3(web3)

		this.setState({isLoaded: true})
	}

	render() {

		const routes = (
			<Routes />
		)
		
		const loading = (
			<Loader active />
		)

		return (
			<div className="App">
				<ConnectedRouter history={history}>
					{this.state.isLoaded ? routes : loading}
				</ConnectedRouter>
			</div>
		)
	}
}

const mapStateToProps = (state: AppState) => ({
	user: state.user,
	ethereum: state.ethereumWeb3.ethereum,
	web3: state.ethereumWeb3.web3,
	router: state.router
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
