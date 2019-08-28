import React, { Component } from "react";
import MessagesList from './list'
import { Route } from "react-router";
import Chat from "./chat";
import UserInfo from "./user-info"

class Messages extends Component {
    render () {
        return (
            <div>
                <MessagesList/>
                <Route path="/main/messages/:userId" render={props => {
                    return (
                        <div>
                            <Chat {...props} />
                            <UserInfo {...props}/>
                        </div>
                    )
                }}/>
            </div>
        )
    }
}

export default Messages