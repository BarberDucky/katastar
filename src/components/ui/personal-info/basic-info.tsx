import React, { Component } from 'react'
import User from '../../../models/user.model';

interface Props {
    user?: User
}

class UserBasicInfo extends Component<Props> {
    render () {
        const user = this.props.user
        return (
            <div>
                {
                    user ? (
                        <div>
                            <span>{user.firstName}</span>
                            <span>{user.lastName}</span>
                            <span>{user.location}</span>
                        </div>
                    ) : (
                        'User not loaded.'
                    )
                }

                
            </div>
        )
    }
}

export default UserBasicInfo