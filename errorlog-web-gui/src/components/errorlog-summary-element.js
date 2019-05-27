/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 * See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

import React from "react";

const queryString = require('query-string');

class ErrorLogSummaryElement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        ErrorLogSummaryElement.nbsp = ErrorLogSummaryElement.nbsp.bind(this);
        this.getLink = this.getLink.bind(this);
    }

    getLink() {
        const queryParams = queryString.parse(location.search);

        queryParams.view = 'details';
        queryParams.app = this.props.item.app;
        queryParams.namespace = this.props.item.namespace;

        if (queryParams.fromSeconds === undefined) {
            queryParams.fromSeconds = 1800; // 30 minutes
        }

        if (queryParams.team === undefined) {
            queryParams.team = 'metascrum';
        }

        return '?' + queryString.stringify(queryParams);
    }


    static nbsp(count) {
        return "\u00a0".repeat(count);
    }

    render() {
        const kind = this.props.item.kind;

        return (
            <div>
                {kind === 'TOTAL' ? <h2>Total: {this.props.item.count}</h2> : null}
                {kind === 'NAMESPACE' ?
                    <h3>{ErrorLogSummaryElement.nbsp(2)}{this.props.item.namespace} ({this.props.item.count})</h3> : null}
                {kind === 'APP' ?
                    <h4>{ErrorLogSummaryElement.nbsp(7)}<a href={this.getLink()}
                                                           target="_blank">{this.props.item.app}</a> ({this.props.item.count})
                    </h4> : null}
                {kind === 'CAUSE' ?
                    <p>{ErrorLogSummaryElement.nbsp(15)}{this.props.item.cause} ({this.props.item.count})</p> : null}
            </div>
        );
    }
}

export default ErrorLogSummaryElement;