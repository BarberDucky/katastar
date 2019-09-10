import React, { Component } from 'react'
import { desiredNetwork } from '../../config/keys'

class WrongNetwork extends Component {
	render() {
		return (
			<div>
				{`Oops, please select the network with the id ${desiredNetwork}.`}
			</div>
		)
	}
}

export default WrongNetwork