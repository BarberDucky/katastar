import React, { Component } from 'react'
import User from '../../models/user.model';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import Web3 from 'web3';
import Header from '../ui/Header';
import { match } from 'react-router';
import { RouterState } from 'connected-react-router';

interface MainProps {
    user: User,
    ethereum: any,
    web3: Web3 | null,
    router: RouterState,
    match: match
}

class Main extends Component<MainProps> {
    render() {
        return (
            <div>
                <Header />
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

export default connect(mapStateToProps)(Main)