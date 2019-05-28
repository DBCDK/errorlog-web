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
    }

    componentDidMount() {
        const queryParams = queryString.parse(location.search);

        this.props.onAppView(queryParams);
    }

    render() {
        return (
            <div className="container-fluid">
                {this.props.appViewData.map((item, key) =>
                    <ErrorlogAppViewElementSimple item={item} key={key}/>
                )}
            </div>
        )
    }

}

export default ErrorLogSummary;