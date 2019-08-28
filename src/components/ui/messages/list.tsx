import React, { Component } from "react";
import { sleep } from "../../../helper";
import { MapStateToProps, connect } from "react-redux";
import { AppState } from "../../../store";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction, bindActionCreators } from "redux";
import { RouterState, Push, push } from "connected-react-router";
import styled from 'styled-components'

interface InputProps {
    isRead: boolean
}

const Item = styled.div`
    > * + * {
        margin-right: 0.5em
    }

    background-color: ${(props: InputProps) => 
        props.isRead ? 'cornflowerblue' : 'inherit'
    };
    width: fit-content;
`

interface UserMessage {
    userId: string
    userName: string
    isRead: boolean
    date: Date
}

interface StateProps {
    router: RouterState
}

interface DispatchProps {
    push: Push
}

interface OwnProps {

}

type Props = StateProps & DispatchProps & OwnProps

interface State {
    isLoading: boolean,
    results: UserMessage[]
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

        await sleep(1000)
        const results: UserMessage[] = [
            {
                userId: '1',
                userName: 'Pera',
                isRead: true,
                date: new Date('1995-12-17T03:24:00') 
            },
            {
                userId: '2',
                userName: 'Mika',
                isRead: false,
                date: new Date('1995-12-17T03:25:00') 
            },
            {
                userId: '3',
                userName: 'Zika',
                isRead: true,
                date: new Date('1995-12-17T03:23:00') 
            },
        ]

        if (this._isMounted)
            this.setState({results, isLoading: false})
    }

    private openDetails(item: UserMessage) {
        this.props.push(`/main/messages/${item.userId}`)
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
                                            key={result.userId}
                                            onClick={() => this.openDetails(result)}
                                        >
                                            <span>{result.userName}</span>
                                            <span>{result.date.toDateString()}</span>
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
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
  bindActionCreators(
    {
      push,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(MessagesList)