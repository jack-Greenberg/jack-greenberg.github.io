import React from 'react';
const axios = require('axios');

import { Link } from 'react-router-dom';

import * as Icon from 'react-feather';

export class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            archetypes: null,
            ready: false,
        }
    }

    componentDidMount() {
        axios.get('http://localhost:1314/archetypes')
        .then(res => {
            console.log(res);
            this.setState({
                archetypes: res.data,
                ready: true,
            })
        })
        .catch(err => {
            console.error(err);
        })
    }

    render() {
        if (this.state.ready) {
            var archetypes = this.state.archetypes.map(item => {
                return <li><Link to={"/" + item.name.toLowerCase()}>{item.name}</Link></li>;
            })

            return (
                <>
                    <input id="sidebar-trigger" type="checkbox" className="sidebar-trigger__checkbox" />
                    <label htmlFor="sidebar-trigger" className="sidebar-trigger__button">
                        <span className="sidebar-trigger__button--menu"><Icon.Menu /></span>
                        <span className="sidebar-trigger__button--x"><Icon.X /></span>
                    </label>
                    <aside className="AdminSidebar">
                        <nav className="AdminSidebar__nav">
                            <Link to="/">Home</Link>
                            <h2>Content</h2>
                            <ul>
                                { archetypes }
                            </ul>
                        </nav>
                    </aside>
                </>
            )
        } else {
            return null;
        }
    }
}
