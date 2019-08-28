import React, {Component} from 'react'
import bind from 'bind-decorator'
import { FormEvent } from "react";
import { formDataToJson as formDataToObject, sleep } from "../../../../helper";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction, bindActionCreators } from "redux";
import { connect, MapStateToProps } from "react-redux";
import { Push, push, RouterState } from "connected-react-router";
import qs from 'qs'
import styled from 'styled-components';
import { AppState } from '../../../../store';

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

export interface ParcelModel {
    id: number,
    owner: string,
    coordinates: number[],
}

export interface ParcelFormData {
    address: string,
    owner: string,
    region: string,
    municipality: string,
    cadastreMunicipality: string
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
    results: ParcelModel[]
}

class ParcelPageComponent extends Component<Props, State> {

    _isMounted = false

    public state: State = {
        isLoading: false,
        results: [],
    }

    public componentDidMount () {
        this._isMounted = true
        this.onRouteChange()
    }

    public componentDidUpdate (oldProps: Props) {
        if (oldProps.router.location.search !== this.props.router.location.search) {
            this.onRouteChange()
        }
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
        const obj = formDataToObject<any>(formData)
        const queryString = qs.stringify(obj)
        const pathName = this.props.router.location.pathname
        this.props.push(pathName + '?' + queryString)
    }

    private async onRouteChange () {
        // const params = qs.parse(this.props.router.location.search.slice(1)) as Partial<AuctionFormData>
        this.setState({isLoading: true})
        await sleep(2000)

        const results: ParcelModel[] = [
            {
                id: 1,
                owner: 'ja',
                coordinates: [],
            },
            {
                id: 2,
                owner: 'ti',
                coordinates: [],
            },
            {
                id: 3,
                owner: 'onae',
                coordinates: [],
            },
        ]
        if (this._isMounted)
            this.setState({results, isLoading: false})
    }

    private openDetails (item: ParcelModel) {
        // const currentPath = this.props.router.location.pathname
        this.props.push(`/parcels/${item.id}`)
    }
 
    render () {
        return (
            <Wrapper>
                <Form onSubmit={this.handleSubmit}>
                    <Label>
                        <span>Address</span>
                        <input type="text" name="address"/>
                    </Label>
                    <Label>
                        <span>Owner</span>
                        <input type="text" name="owner"/>
                    </Label>
                    <Label>
                        <span>Region</span>
                        <input type="text" name="region"/>
                    </Label>
                    <Label>
                        <span>Municipality</span>
                        <input type="text" name="municipality"/>
                    </Label>
                    <Label>
                        <span>Cadaste Municipality</span>
                        <input type="text" name="cadastreMunicipality"/>
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
                                        <th>Owner</th>
                                        <th>Deadline</th>
                                        <th>Parcel Id</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.results.map(result => {
                                            return (
                                                <tr key={result.id} onClick={() => this.openDetails(result)}>
                                                    <td>{result.id}</td>
                                                    <td>{result.owner}</td>
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

export default connect(mapStateToProps, mapDispatchToProps)(ParcelPageComponent)
