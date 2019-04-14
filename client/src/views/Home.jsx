import React from 'react'
import CreateNote from '../components/NewNote';

const Home = (props) => {
	return (
		<div className='Home'>
			{props.currentUser
				? (
					<CreateNote />
				)
				: (
					<h1>Not Logged</h1>
				)
			}
		</div>
	)
}

export default Home;