import React, { Component } from 'react'
import { RouterState, Push, push } from 'connected-react-router';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';
import { match } from 'react-router';
import { sleep } from '../../../helper';
import bind from 'bind-decorator';

interface UserDetails {
    userId: string
    firstName: string
    lastName: string
    parcels: string[]
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
    results?: UserDetails
}

class UserInfo extends Component<Props, State> {

    state: State = {
        isLoading: true,
        results: undefined
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

        const results: UserDetails = {
            userId: '1',
            firstName: 'Bosko',
            lastName: 'Milojkovic',
            parcels: ['1', '2', '3']
        }
        if (this._isMounted)
            this.setState({results, isLoading: false})
    }

    @bind 
    private selectParcel (parcelId: string) {
        this.props.push(`/parcels/${parcelId}`)
    }

    @bind 
    private selectUser (userId: string) {
        this.props.push(`/users/${userId}`)
    }

    render () {
        return (
            <div>
                {
                    this.state.isLoading ? (
                        'Loading...'
                    ) : this.state.results === undefined ? (
                        'Select message to see user details.'
                    ) : (
                        <div>
                            <div 
                                onClick={() => this.selectUser(this.state.results ? this.state.results.userId : '')}
                            > 
                                <span>{this.state.results.firstName}</span>
                                <span>{this.state.results.lastName}</span>
                            </div>
                            {
                                this.state.results.parcels.length !== 0 ? (
                                    <div>
                                        {
                                            this.state.results.parcels.map(result => {
                                                return (
                                                    <div 
                                                        key={`userParcel${result}`}
                                                        onClick={() => this.selectParcel(result)}       
                                                    >
                                                        <span>{result}</span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                ) : (
                                    'User has no parcels.'
                                )
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

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo)