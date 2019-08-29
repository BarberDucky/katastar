import React, {Component} from 'react'
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
import { searchAuctions } from '../../../../services/auction.service';
import Auction from '../../../../models/auction.model';

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

export interface AuctionFormData {
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
    results: Auction[]
}

class AuctionPageComponent extends Component<Props, State> {

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
        const params = qs.parse(this.props.router.location.search.slice(1)) as AuctionFormData
        this.setState({isLoading: true})
        
        const results = await searchAuctions(params)

        if (this._isMounted)
            this.setState({results, isLoading: false})
    }

    private openDetails (item: Auction) {
        // const currentPath = this.props.router.location.pathname
        this.props.push(`/auctions/${item.address}`)
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
                                                <tr key={result.address} onClick={() => this.openDetails(result)}>
                                                    <td>{result.address}</td>
                                                    <td>{result.owner}</td>
                                                    <td>{result.deadline}</td>
                                                    <td>{result.parcel.address}</td>
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

export default connect(mapStateToProps, mapDispatchToProps)(AuctionPageComponent)
