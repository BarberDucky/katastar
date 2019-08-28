import React, { Component, FormEvent } from 'react'
import { RouterState, Push, push } from 'connected-react-router';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { bindActionCreators, AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import Auction from '../../../models/auction.model';
import bind from 'bind-decorator';
import Parcel from '../../../models/parcel.model';
import { formDataToJson } from '../../../helper';
import User from '../../../models/user.model';
import { createAuction } from '../../../services/auction.service';

interface StateProps {
    router: RouterState
    user: User
}

interface DispatchProps {
    push: Push
}

interface OwnProps {
    isOwner: boolean
    auctions: Auction[]
    parcels: Parcel[]
}

type Props = StateProps & DispatchProps & OwnProps

interface State {

}

class AuctionsList extends Component<Props, State> {

    @bind
    private openDetails(auction: Auction) {
        this.props.push(`/auction/${auction.address}`)
    }

    @bind
    private async handleSubmit (reactEvent: FormEvent<HTMLFormElement>) {
        const event = reactEvent.nativeEvent as Event
        event.preventDefault()
        const target = event.target as HTMLFormElement
        const formData = new FormData(target)
        let obj = formDataToJson<Auction>(formData)
        obj = {
            isDone: false,
            address: '',
            owner: this.props.user.address,
            ...obj
        }
        await createAuction(obj)
    }

    render () {
        return (
            <div>
                {
                    this.props.isOwner ? (
                        <div>
                            <span>Create new auction</span>
                            <form onSubmit={this.handleSubmit}>
                                <input name="startingPrice" type="number" min="0" required/>
                                <input name="deadline" required/>
                                <select name="parcel" required>
                                    {
                                        this.props.parcels.map(parcel => {
                                            return (
                                                <option 
                                                    value={parcel.address} 
                                                    key={`auctionParcel${parcel.address}`}
                                                >
                                                    {parcel.address}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                                <button>Create New Auction</button>
                            </form>
                        </div>
                    ) : (
                        ''
                    )
                }
                {
                    this.props.auctions.length === 0 ? (
                        'User has no auctions.'
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Owner</th>
                                    <th>Parcel</th>
                                    <th>Deadline</th>
                                    <th>Is Done?</th>
                                    <th>Starting Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.auctions.map(auction => {
                                        return (
                                            <tr key={`userAuction${auction.address}`} onClick={() => this.openDetails(auction)}>
                                                <td>{auction.address}</td>
                                                <td>{auction.owner}</td>
                                                <td>{auction.parcel}</td>
                                                <td>{auction.deadline}</td>
                                                <td>{auction.isDone}</td>
                                                <td>{auction.startingPrice}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
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
        dispatch
    )

export default connect(mapStateToProps, mapDispatchToProps)(AuctionsList)