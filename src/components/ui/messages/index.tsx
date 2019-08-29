import React, { Component } from "react";
import MessagesList from './list'
import { Route, Switch } from "react-router";
import Chat from "./chat";
import UserInfo from "./user-info"
import NewConversation from "./new-conversation";

class Messages extends Component {
    render () {
        return (
            <div>
                <MessagesList/>
                <Switch>
                    <Route path="/main/messages/new/:userId" render={props => {
                        return (
                            <div>
                                <NewConversation {...props}/>
                                <UserInfo {...props}/>
                            </div>
                        )
                    }}/>
                    <Route path="/main/messages/:userId" render={props => {
                        return (
                            <div>
                                <Chat {...props} />
                                <UserInfo {...props}/>
                            </div>
                        )
                    }}/>
                </Switch>
            </div>
        )
    }
}

export default Messages