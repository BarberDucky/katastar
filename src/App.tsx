import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
declare let window: any;
const desiredNetwork = '3'

class App extends Component{

    componentDidMount() {
      if (typeof window.ethereum === 'undefined') {
        alert('You need metamask to continue')
        return
      }

      if (window.ethereum.networkVersion !== desiredNetwork) {
        alert('Select the network with id = ' + desiredNetwork)
        return
      }
      window.ethereum.enable()
        .catch((reason : string) => {
          alert(reason)
        })
        .then((accounts: Array<string>) => {
          alert('Successful connection')
          console.log(accounts)
        })
    }

    render() {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      )
    }
}

export default App
