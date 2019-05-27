/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 * See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

import React from "react";
import ErrorLogAppViewElementFull from './errorlog-app-view-element-full'

class ErrorLogAppViewElementSimple extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showDetails: false
        };

        this.formatDate = this.formatDate.bind(this);
        this.formatMessage = this.formatMessage.bind(this);
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

    onClick() {
        this.setState(oldState => ({ showDetails: !oldState.showDetails }));
    }

    render() {
        return (
            <div>
                <div onClick={this.onClick}>
                    {this.formatDate()}: {this.formatMessage()}
                </div>
                <div  id="p_wrap">
                    {this.state.showDetails && <ErrorLogAppViewElementFull item={this.props.item}/>}
                </div>
                {this.state.showDetails && <hr/>}
            </div>
        );
    }
}

export default ErrorLogAppViewElementSimple;