/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 * See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

import React from "react";
import ErrorlogAppViewElementSimple from "./errorlog-app-view-element-simple";

const queryString = require('query-string');
const request = require('superagent');

class ErrorLogSummary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {entities: []}
        };

        this.loadDetails = this.loadDetails.bind(this);

        console.log("constructor");
    }

    componentDidMount() {
        console.log("componentDidMount");
        this.loadDetails();
    }

    loadDetails() {
        console.log("loadDetails");
        const queryParams = queryString.parse(location.search);
        const app = queryParams.app;
        const namespace = queryParams.namespace;
        const team = queryParams.team;
        const fromSeconds = queryParams.fromSeconds;

        console.log(this.state);
        request
            .get('/api/v1/details')
            .query({team: team, 'from-seconds': fromSeconds, app: app, ns: namespace})
            .then(res => {
                this.setState({data: res.body});
                console.log(res.body);
            })
            .catch(err => {
                alert(err.message);
            });
    }

    render() {
        return (
            <div className="container-fluid">
                {this.state.data.entities.map((item, key) =>
                    <ErrorlogAppViewElementSimple item={item} key={key}/>
                )}
            </div>
        )
    }

}

export default ErrorLogSummary;