import React, { Component } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import PatImg from '../../assets/pat-coin-rich.png'
import { Image } from 'semantic-ui-react'
import { generateIdenticon } from '../../helper'

const HeaderContainer = styled.div`
  width: 100%;
  height: 4.5em;
  color: white;
  background-color: cornflowerblue;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 0 10px;
  box-sizing: border-box;
`

const TitleAndImage = styled.div`
	display: flex;
	align-items: center;
	> * {
		margin-right: 1em;
	}
`

const Title = styled.h1`
  margin: 0;
  margin-top: -5px;
`

const Menu = styled.div`
  height: 100%;
  display: flex;
`

const MenuItem = styled(NavLink)`
  height: 100%;
  padding: 0 10px 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;

  &:hover {
    cursor: pointer;
    background-color: #1678c2;
    color: white;
  }
`

interface OwnProps {
  userId: string
  userFirstName: string
}

type Props = OwnProps

class Header extends Component<Props> {
	render() {
		return (
			<HeaderContainer>
				<TitleAndImage>
					<img src={PatImg} alt='cadastre-logo' height='48' />
					<Title>Cadastre</Title>
				</TitleAndImage>

				<Menu>
					<MenuItem to="/main/explorer" >Explore</MenuItem>
					<MenuItem to="/main/messages" >Messages</MenuItem>
					<MenuItem to={`/main/users/${this.props.userId}`} >
              <Image src={generateIdenticon(this.props.userId)} size="mini" avatar/>
              {this.props.userFirstName}
          </MenuItem>
				</Menu>
			</HeaderContainer>
		)
	}
}

export default Header