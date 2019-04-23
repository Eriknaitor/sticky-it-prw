import React, { Component } from 'react'
import Feed from '../components/Feed';

export default class MyNotes extends Component {
	render() {
		return (
			<Feed url={'http://localhost:8000/api/notes?index='} currentUser={this.props.currentUser} />
		)
	}
}
