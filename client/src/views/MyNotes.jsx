import React, { Component } from 'react'
import Feed from '../components/Feed';

export default class MyNotes extends Component {
	render() {
		return (
			<Feed url={'/notes?index='} currentUser={this.props.currentUser} />
		)
	}
}
