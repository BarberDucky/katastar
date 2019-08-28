import { Component, FormEvent } from "react";
import bind from "bind-decorator";
import { formDataToJson, sleep } from "../../../../helper";
import qs from 'qs'
import { connect, MapStateToProps } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction, bindActionCreators } from "redux";
import { RouterState, Push, push } from "connected-react-router";
import { AppState } from "../../../../store";

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
    isLoading: boolean
}



class ExplorerEntityBase extends Component<Props, State> {
    _isMounted = false

    public state: State = {
        isLoading: false,
    }

    public componentDidMount () {
        this._isMounted = true
    }

    public componentWillUnmount() {
        this._isMounted = false
    }

    @bind
    private handleSubmit (reactEvent: FormEvent<HTMLFormElement>) {
        const event = reactEvent.nativeEvent as Event
        event.preventDefault()
        const target = event.target as HTMLFormElement
        const formData = new FormData(target)
        const obj = formDataToJson<any>(formData)
        const queryString = qs.stringify(obj)
        const pathName = this.props.router.location.pathname
        this.props.push(pathName + '?' + queryString)
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

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerEntityBase)