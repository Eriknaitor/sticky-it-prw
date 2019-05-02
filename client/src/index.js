import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import 'normalize.css'
import 'milligram'
import './styles.css'
import './mediaqueries.css'
import App from './App'

render(
	<Router><App /></Router>,
	document.getElementById('root')
)