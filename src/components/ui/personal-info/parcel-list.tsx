import React, { Component } from 'react'
import Parcel from '../../../models/parcel.model';
import { RouterState, Push, push } from 'connected-react-router';
import { MapStateToProps, connect } from 'react-redux';
import { AppState } from '../../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';
import bind from 'bind-decorator';
import { Table } from 'semantic-ui-react';

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
        this.props.push(`/parcels/${parcel.address}`)
    }

    render () {
        return (
            <div>
                {
                    this.props.parcels.length === 0 ? (
                        'User owns no parcels.'
                    ) : (
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>id</Table.HeaderCell>
                                    <Table.HeaderCell>Owner</Table.HeaderCell>
                                    <Table.HeaderCell>Region</Table.HeaderCell>
                                    <Table.HeaderCell>Municipality</Table.HeaderCell>
                                    <Table.HeaderCell>Cadastre Municipality</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    this.props.parcels.map(parcel => {
                                        return (
                                            <Table.Row key={`userParcel${parcel.address}`} onClick={() => this.openDetails(parcel)}>
                                                <Table.Cell>{parcel.address}</Table.Cell>
                                                <Table.Cell>{parcel.owner}</Table.Cell>
                                                <Table.Cell>{parcel.region}</Table.Cell>
                                                <Table.Cell>{parcel.municipality}</Table.Cell>
                                                <Table.Cell>{parcel.cadastreMunicipality}</Table.Cell>
                                            </Table.Row>
                                        )
                                    })
                                }
                            </Table.Body>
                        </Table>
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