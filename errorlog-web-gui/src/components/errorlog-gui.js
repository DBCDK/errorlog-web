/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 * See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

import React from "react";

class ErrorlogGui extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hello: "world"
        };

    }

    render() {
        return (
            <div className="container-fluid">
                <h2>Error Log Web</h2>
                <hr/>
                <div>a</div>
                <div>b</div>
                <div>c</div>
            </div>
        )
    }

}

export default ErrorlogGui;
