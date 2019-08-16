import React, { Component } from 'react'
import User from '../../models/user.model';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import Web3 from 'web3';

interface MainProps {
    user: User,
    ethereum: any,
    web3: Web3 | null
}

class Main extends Component<MainProps> {
    render() {
        return (
            <div>
                Current address {this.props.user.address}
                <br/>
                Ethereum {this.props.ethereum != null ? this.props.ethereum.selectedAddress : 'Ethereum provider is null'}
                <br/>
                Web3 {this.props.web3 != null ? this.props.web3.version : 'Web3 is null'}
            </div>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    user: state.user,
    ethereum: state.ethereumWeb3.ethereum,
    web3: state.ethereumWeb3.web3
})

export default connect(mapStateToProps)(Main)