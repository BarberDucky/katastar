import React, { Component } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const HeaderContainer = styled.div`
    width: 100%;
    height: 4em;
    color: white;
    background-color: cornflowerblue;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px 0 10px;
    box-sizing: border-box;
`

const StyledTitle = styled.h1`
    margin: 0;
    margin-top: -5px;
`

const Menu = styled.div`
    height: 100%;
    display: flex;
`

const MenuItem = styled(NavLink)`
    height: 100%;
    width: 6em;
    padding: 0 10px 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: white;

    &:hover {
        cursor: pointer;
        background-color: blue;
    }
`

interface OwnProps {
    userId: string
}

type Props = OwnProps

class Header extends Component<Props> {
    render() {
        return (
            <HeaderContainer>
                <StyledTitle>Katastar</StyledTitle>

                <Menu>
                    <MenuItem to="/main/explorer" >Explore</MenuItem>
                    <MenuItem to="/main/messages" >Messages</MenuItem>
                    <MenuItem to={`/main/users/${this.props.userId}`} >Personal</MenuItem>
                </Menu>
            </HeaderContainer>
        )
    }
}

export default Header