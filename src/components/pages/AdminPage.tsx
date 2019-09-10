import React, { Component } from 'react'
import { AppState } from '../../store'
import { connect } from 'react-redux'
import User from '../../models/user.model'
import Web3 from 'web3'
import { burnAllTokens, generateParcels, readParcelsFromChain } from '../../services/parcel.service'
import bind from 'bind-decorator'

interface Props {
  user: User
  ethereum: any
  web3: Web3 | null
}

class AdminPage extends Component<Props> {

  @bind
  async getTokens() {
    if (this.props.web3) {
      const tokens = await readParcelsFromChain(this.props.web3)
      console.log(tokens)
    } else {
      alert('no web3')
    }
  }

  @bind
  async getAccounts() {
    if (this.props.web3) {
      const accounts = await this.props.web3.eth.getAccounts()
      console.log(accounts)
    } else {
      alert('no web3')
    }
  }

  @bind
  async generateParcels() {
    if (this.props.web3) {
      await generateParcels(this.props.web3, this.props.user.address)
    } else {
      alert('no web3')
    }
  }

  @bind
  async deleteAllParcels() {
    if (this.props.web3) {
      await burnAllTokens(this.props.web3, this.props.user.address)
    } else {
      alert('no web3')
    }
  }


  render() {
    return (
      <div>
        <h1>Admin Page</h1>
        <span>{window.ethereum.selectedAddress}</span>
        <button onClick={() => this.getTokens()}>Get Tokens</button> 
        <button onClick={() => this.getAccounts()}>Get Accounts</button> 
        <button onClick={() => this.generateParcels()}>Generate Parcels</button>
        <button onClick={() => this.deleteAllParcels()}>Delete All Parcels</button>
      </div>
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  ethereum: state.ethereumWeb3.ethereum,
  web3: state.ethereumWeb3.web3,
})

export default connect(mapStateToProps)(AdminPage)