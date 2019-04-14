import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import 'milligram'
import './styles.css'
import App from './App'

render(
	<Router><App /></Router>,
	document.getElementById('root')
)