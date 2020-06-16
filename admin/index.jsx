import React from 'react';
import ReactDOM  from 'react-dom';

import { ErrorBoundary } from './error-boundary.jsx';
import { Router } from './router.jsx';

// import client from './api';
const axios = require('axios');

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            archetypes: null
        }
    }

    componentDidMount() {
        axios.get('http://localhost:1314/archetypes')
        .then(res => {
            console.log(res);
            this.setState({
                ready: true,
                archetypes: res.data,
            })
        })
        .catch(err => {
            console.error(err);
        })
    }

    render() {
        if (this.state.ready) {
            return (
                <div className="Admin">
                    <Router archetypes={this.state.archetypes} />
                </div>
            )
        } else {
            return null;
        }
    }
}

var safeApp = (
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
)

ReactDOM.render(safeApp, document.getElementById('root'))
