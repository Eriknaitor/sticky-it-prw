import React from 'react'
import { render } from 'react-dom';
import { HashRouter as Router } from 'react-router-dom'
import 'normalize.css'
import 'milligram'
import './styles.css'
import App from './App'

render(
	<Router><App /></Router>,
	document.getElementById('root')
)