import React, { Component, FormEvent } from 'react'
import { RouterState, Push, push } from 'connected-react-router';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';
import { match } from 'react-router';
import { sleep, formDataToJson } from '../../../helper';
import bind from 'bind-decorator';

interface Message {
    fromId: string
    fromName: string
    toId: string
    toName: string
    content: string
}

interface StateProps {
    router: RouterState
}

interface DispatchProps {
    push: Push
}

interface ParamProps {
    userId: string
}

interface OwnProps {
    match: match<ParamProps>
}

type Props = StateProps & DispatchProps & OwnProps

interface State {
    isLoading: boolean,
    results: Message[]
}

class Chat extends Component<Props, State> {

    state: State = {
        isLoading: true,
        results: []
    }

    _isMounted = false

    public async componentDidMount() {
        this._isMounted = true
        this.onRouteChange()
    }

    public componentDidUpdate(oldProps: Props) {
        if (oldProps.router.location.pathname !== this.props.router.location.pathname) {
            this.onRouteChange()
        }
    }

    public componentWillUnmount() {
        this._isMounted = false
    }

    private async onRouteChange() {
        this.setState({isLoading: true})
        await sleep(1000)

        const results: Message[] = [
            {
                fromId: '1',
                fromName: 'Lazar',
                toId: '2',
                toName: 'Damjan',
                content: 'Cao Damjane'
            },
            {
                fromId: '1',
                fromName: 'Lazar',
                toId: '2',
                toName: 'Damjan',
                content: 'Sta radis'
            },
            {
                fromId: '2',
                fromName: 'Damjan',
                toId: '1',
                toName: 'Ana',
                content: 'Evo nista, radim diplomski'
            },
            {
                fromId: '1',
                fromName: 'Lazar',
                toId: '2',
                toName: 'Damjan',
                content: 'Glupsi'
            },
        ]
        if (this._isMounted)
            this.setState({results, isLoading: false})
    }

    @bind
    private sendMessage (reactEvent: FormEvent<HTMLFormElement>) {
        const event = reactEvent.nativeEvent as Event
        event.preventDefault()
        const target = event.target as HTMLFormElement
        const formData = new FormData(target)
        const obj = formDataToJson<any>(formData)
        console.log(obj)
    }

    render () {
        return (
            <div>
                {
                    this.state.isLoading ? (
                        'Loading...'
                    ) : (
                        <div>
                            {
                                this.state.results.map((result, index) => {
                                    return (
                                        <div key={`chat${index}`}>
                                            {result.content}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }

                <form onSubmit={ev => this.sendMessage(ev)}>
                    <input 
                        name="sentMessage"
                        placeholder="Type message..." 
                    />
                    <button> --> </button>
                </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(Chat)