import React from 'react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import spanishStrings from 'react-timeago/lib/language-strings/es';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
const formatter = buildFormatter(spanishStrings);

const NotFound = () => (
    <div>
        <h1>404 :(</h1>
        Publicado <TimeAgo date='Feb 1, 1966' formatter={formatter} />
        <center><Link to="/">Return to Home Page</Link></center>
    </div>
);

export default NotFound;