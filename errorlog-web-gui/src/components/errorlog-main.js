/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 * See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

import React from "react";
import ErrorLogSummary from "./errorlog-summary";
import ErrorLogAppView from "./errorlog-app-view"

const request = require('superagent');
const queryString = require('query-string');

class ErrorLogMain extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            summaryData: [],
            appViewData: []
        };

        this.loadSummary = this.loadSummary.bind(this);
        this.loadAppView = this.loadAppView.bind(this);
    }

    componentDidMount() {
        const queryParams = queryString.parse(location.search);

        if (queryParams.view === undefined) {
            console.log("View missing - setting default");
            queryParams.view = 'summary'; // 30 minutes
            location.search = queryString.stringify(queryParams);
        }
    }

    loadAppView(queryParams) {
        request
            .get('/api/v1/appview')
            .query(queryParams)
            .then(res => {

                this.setState({appViewData: res.body.entities});
            })
            .catch(err => {
                alert(err.message);
            });
    }

    loadSummary(queryParams, data) {
        request
            .get('/api/v1/summary')
            .query(queryParams)
            .then(res => {
                this.setState({summaryData: res.body})
            })
            .catch(err => {
                alert(err.message);
            });
    }

    render() {
        const queryParams = queryString.parse(location.search);

        return (
            <div className="container-fluid">
                {queryParams.view === 'summary' ?
                    <ErrorLogSummary onSummary={this.loadSummary} summaryData={this.state.summaryData}/> :
                    <ErrorLogAppView onAppView={this.loadAppView} appViewData={this.state.appViewData}/>}
            </div>
        )
    }

}

export default ErrorLogMain;