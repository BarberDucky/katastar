import React, { Component } from 'react'
import bind from 'bind-decorator'
import { FormEvent } from "react";
import { formDataToJson as formDataToObject } from "../../../../helper";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction, bindActionCreators } from "redux";
import { connect, MapStateToProps } from "react-redux";
import { Push, push, RouterState } from "connected-react-router";
import qs from 'qs'
import styled from 'styled-components';
import { AppState } from '../../../../store';
import { searchUsers } from '../../../../services/user.service';
import User from '../../../../models/user.model';

const Wrapper = styled.div``

const Form = styled.form`
    display: flex;
    > * + * {
        margin-left: 1em;
    }
`

const Label = styled.label`
    display: flex;
    flex-direction: column;
    > * + * {
        margin-top: 0.33em;
    }
`

const Main = styled.main``

export interface UserFormData {
    address: string,
    firstName: string,
    lastName: string,
    location: string
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
    isLoading: boolean
    results: User[]
}

class UserPageComponent extends Component<Props, State> {

    _isMounted = false

    public state: State = {
        isLoading: false,
        results: [],
    }

    public componentDidMount() {
        this._isMounted = true
        this.onRouteChange()
    }

    public componentDidUpdate(oldProps: Props) {
        if (oldProps.router.location.search !== this.props.router.location.search) {
            this.onRouteChange()
        }
    }

    public componentWillUnmount() {
        this._isMounted = false
    }

    @bind
    private handleSubmit(reactEvent: FormEvent<HTMLFormElement>) {
        const event = reactEvent.nativeEvent as Event
        event.preventDefault()
        const target = event.target as HTMLFormElement
        const formData = new FormData(target)
        const obj = formDataToObject<UserFormData>(formData)
        const queryString = qs.stringify(obj)
        const pathName = this.props.router.location.pathname
        this.props.push(pathName + '?' + queryString)
    }

    private async onRouteChange() {
        const params = qs.parse(this.props.router.location.search.slice(1)) as UserFormData
        this.setState({ isLoading: true })
        const results = await searchUsers(params)

        if (this._isMounted)
            this.setState({ results, isLoading: false })
    }

    private openDetails(item: User) {
        // const currentPath = this.props.router.location.pathname
        this.props.push(`/users/${item.address}`)
    }

    render() {
        return (
            <Wrapper>
                <Form onSubmit={this.handleSubmit}>
                    <Label>
                        <span>Address</span>
                        <input type="text" name="address" />
                    </Label>
                    <Label>
                        <span>First Name</span>
                        <input type="text" name="firstName" />
                    </Label>
                    <Label>
                        <span>Last Name</span>
                        <input type="text" name="lastName" />
                    </Label>
                    <Label>
                        <span>Location</span>
                        <input type="text" name="location" />
                    </Label>
                    <button type="submit">
                        Search
                    </button>
                </Form>
                <Main>
                    {
                        this.state.isLoading ? (
                            'Loading...'
                        ) : this.state.results.length === 0 ? (
                            `No results.`
                        ) : (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>id</th>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.results.map(result => {
                                                    return (
                                                        <tr key={result.address} onClick={() => this.openDetails(result)}>
                                                            <td>{result.address}</td>
                                                            <td>{result.firstName}</td>
                                                            <td>{result.lastName}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                )
                    }
                </Main>
            </Wrapper>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserPageComponent)
