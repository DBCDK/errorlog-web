/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 * See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

import React from "react";

const indentation = '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0';

class ErrorLogAppViewElementSimple extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showDetails: false
        };

        this.formatDate = this.formatDate.bind(this);
        this.formatMessage = this.formatMessage.bind(this);
        this.formatStacktrace = this.formatStacktrace.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    formatDate() {
        const date = new Date(this.props.item.timeLogged);

        return date.toISOString();
    }

    formatMessage() {
        const message = this.props.item.message;
        if (message.length > 200) {
            return message.substr(0, 200) + '...';
        } else {
            return message;
        }
    }

    formatStacktrace() {
        let stacktrace = this.props.item.stacktrace;

        if (stacktrace === undefined) {
            return '';
        }

        stacktrace = stacktrace.replace("\n", '<br/>');
        stacktrace = stacktrace.replace("\t", indentation.repeat(2));

        return stacktrace
    }

    onClick() {
        this.setState({showDetails: true});
    }

    render() {
        return (
            <div>
                <div>{indentation}app: {this.props.item.app}</div>
                <div>{indentation}namespace: {this.props.item.namespace}</div>
                <div>{indentation}host: {this.props.item.host}</div>
                <div>{indentation}container: {this.props.item.container}</div>
                <div>{indentation}message: {this.props.item.message}</div>
                <div>{indentation}team: {this.props.item.team}</div>
                <div>{indentation}logger: {this.props.item.logger}</div>
                <div>{indentation}cause: {this.props.item.cause}</div>
                <div>{indentation}stacktrace: {this.formatStacktrace()}</div>
                <div>{indentation}timeLogged: {this.formatDate()}</div>
            </div>
        );
    }

}

export default ErrorLogAppViewElementSimple;