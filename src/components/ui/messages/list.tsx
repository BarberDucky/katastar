import React, { Component } from "react";
import { MapStateToProps, connect } from "react-redux";
import { AppState } from "../../../store";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction, bindActionCreators } from "redux";
import { RouterState, Push, push } from "connected-react-router";
import styled from 'styled-components'
import User, { ConversationInfo } from "../../../models/user.model";

interface InputProps {
    isRead: boolean
}

const Item = styled.div`
    > * + * {
        margin-right: 0.5em
    }

    background-color: ${(props: InputProps) => 
        !props.isRead ? 'cornflowerblue' : 'inherit'
    };
    width: fit-content;
`

interface StateProps {
    router: RouterState
    user: User
}

interface DispatchProps {
    push: Push
}

interface OwnProps {

}

type Props = StateProps & DispatchProps & OwnProps

interface State {
    isLoading: boolean,
    results: ConversationInfo[]
}


class MessagesList extends Component<Props, State> {

    state: State = {
        isLoading: true, 
        results: [],
    }
    _isMounted = false

    public componentDidMount() {
        this._isMounted = true
        this.onRouteChange()
    }

    public componentWillUnmount() {
        this._isMounted = false
    }

    private async onRouteChange() {
        this.setState({isLoading : true})
        const results = Object.values(this.props.user.conversations)
        console.log(results)
        if (this._isMounted)
            this.setState({results, isLoading: false})
    }

    private openDetails(item: ConversationInfo) {
        this.props.push(`/main/messages/${item.fromId}`)
    }

    render () {
        return (
            <div>
                {
                    this.state.isLoading ? (
                        'Loading...'
                    ) : this.state.results.length === 0 ? (
                        'No results...'
                    ) : (
                        <div>
                            {
                                this.state.results.map(result => {
                                    return (
                                        <Item 
                                            isRead={result.isRead}
                                            key={`conversationinfo${result.conversationId}`}
                                            onClick={() => this.openDetails(result)}
                                        >
                                            <span>{result.fromName}</span>
                                        </Item>
                                    )
                                })
                            }
                        </div>    
                    )
                }
            </div>
        )
    }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({
    router: state.router,
    user: state.user
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
  bindActionCreators(
    {
      push,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(MessagesList)