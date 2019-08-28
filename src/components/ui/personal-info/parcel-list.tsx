import React, { Component } from 'react'
import Parcel from '../../../models/parcel.model';
import { RouterState, Push, push } from 'connected-react-router';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';
import bind from 'bind-decorator';

interface StateProps {
    router: RouterState
}

interface DispatchProps {
    push: Push
}

interface OwnProps {
    parcels: Parcel[]
}

type Props = OwnProps & StateProps & DispatchProps

interface State {

}

class ParcelList extends Component<Props, State> {

    @bind
    private openDetails(parcel: Parcel) {
        console.log(parcel)
        this.props.push(`/parcels/${parcel.address}`)
    }

    render () {
        return (
            <div>
                {
                    this.props.parcels.length === 0 ? (
                        'User owns no parcels.'
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Owner</th>
                                    <th>Region</th>
                                    <th>Municipality</th>
                                    <th>Cadastre Municipality</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.parcels.map(parcel => {
                                        return (
                                            <tr key={`userParcel${parcel.address}`} onClick={() => this.openDetails(parcel)}>
                                                <td>{parcel.address}</td>
                                                <td>{parcel.owner}</td>
                                                <td>{parcel.region}</td>
                                                <td>{parcel.municipality}</td>
                                                <td>{parcel.cadastreMunicipality}</td>
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
    router: state.router
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => 
    bindActionCreators(
        {
            push,
        },
        dispatch
    )

export default connect(mapStateToProps, mapDispatchToProps)(ParcelList)