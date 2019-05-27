/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 * See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

import React from "react";
import ErrorLogSummary from "./errorlog-summary";
import ErrorLogAppView from "./errorlog-app-view"
const queryString = require('query-string');

class ErrorLogMain extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const queryParams = queryString.parse(location.search);

        if (queryParams.view === undefined) {
            console.log("View missing - setting default");
            queryParams.view = 'summary'; // 30 minutes
            location.search = queryString.stringify(queryParams);
        }
    }

    render() {
        const queryParams = queryString.parse(location.search);

        return (
            <div className="container-fluid">
                {queryParams.view === 'summary' ? <ErrorLogSummary/> : <ErrorLogAppView/>}
            </div>
        )
    }

}

export default ErrorLogMain;