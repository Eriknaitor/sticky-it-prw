import React, { Component } from 'react'
import Feed from '../components/Feed';

export default class Saved extends Component {
    render() {
        return (
            <Feed url={'/notes/saved?index='} currentUser={this.props.currentUser} />
        )
    }
}
