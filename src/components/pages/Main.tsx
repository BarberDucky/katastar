import React, { Component } from 'react'
import User from '../../models/user.model';
import { AppState } from '../../store';
import { connect } from 'react-redux';

interface MainProps {
    user: User
}

class Main extends Component<MainProps> {
    render() {
        return (
            <div>
                Current address {this.props.user.address}
            </div>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
	user: state.user
})

export default connect(mapStateToProps)(Main)