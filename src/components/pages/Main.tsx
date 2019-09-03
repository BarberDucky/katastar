import React, { Component } from 'react'
import User from '../../models/user.model';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import Web3 from 'web3';
import Header from '../ui/header';
import { match, Switch, Route, Redirect } from 'react-router';
import { RouterState } from 'connected-react-router';
import Explorer from '../ui/explorer';
import Messages from '../ui/messages';
import PersonalInfo from '../ui/personal-info';
import ParcelPage from '../ui/parcel'
import AuctionPage from '../ui/auction'
import DealPage from '../ui/deal'
import InheritancePage from '../ui/inheritance'
import style from 'styled-components'

const Wrapper = style.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`

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
            <Wrapper>
                <Header userId={this.props.user.address}/>

                <Switch>
                    <Route path="/main/explorer/:searchEntity" component={Explorer}></Route>
                    <Route path="/main/messages/" component={Messages}></Route>
                    <Route path="/main/users/:userId" component={PersonalInfo}></Route>
                    <Route path="/main/parcels/:parcelId" component={ParcelPage}></Route>
                    <Route path="/main/auctions/:auctionId" component={AuctionPage}></Route>
                    <Route path="/main/deals/:dealId" component={DealPage} ></Route>
                    <Route path="/main/inheritances/:inheritanceId" component={InheritancePage} ></Route>
                    <Redirect to="/main/explorer/parcels"></Redirect>
                </Switch>
            </Wrapper>
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