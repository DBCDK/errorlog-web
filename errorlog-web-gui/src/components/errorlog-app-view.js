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
    }

    componentDidMount() {
        this.loadDetails();
    }

    loadDetails() {
        const queryParams = queryString.parse(location.search);

        request
            .get('/api/v1/appview')
            .query(queryParams)
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