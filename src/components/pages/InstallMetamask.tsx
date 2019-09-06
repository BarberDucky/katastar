import React, { Component } from 'react'
import MetamaskImg from '../../assets/metamask.png'
import styled from 'styled-components'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    > * + * {
        margin-top: 4em;
    }
`

class InstallMetamask extends Component {
    render() {
        return (
            <Wrapper>
                <span>Oops, please install Metamask.</span>
                <a href='https://metamask.io/'>
                    <img src={MetamaskImg} height="100" alt="download-metamask"/>
                </a>
            </Wrapper>
        )
    }
}

export default InstallMetamask