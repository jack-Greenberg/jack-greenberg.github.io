import React from 'react';
import { HashRouter, Route, Switch } from "react-router-dom";

import { Home } from './pages/home.jsx';
import { Content } from './pages/content.jsx';
import { Sidebar } from './partials/sidebar.jsx';

export class Router extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var contentRoutes = this.props.archetypes.map(a => {
            return <Route path={"/" + a.name.toLowerCase()} render={(props) => <Content name={a.name} />} />;
        });

        return (
            <HashRouter>
                <Sidebar />
                <Switch>
                    <Route exact path="/" render={(props) => <Home />} />
                    { contentRoutes }
                </Switch>
            </HashRouter>
        )
    }
}
