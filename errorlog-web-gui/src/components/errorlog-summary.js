/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 * See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

import React from "react";
import {Button, ButtonToolbar} from "react-bootstrap";
import ErrorLogSummaryElement from "./errorlog-summary-element";

const queryString = require('query-string');

class ErrorLogSummary extends React.Component {

    constructor(props) {
        super(props);

        ErrorLogSummary.setFromSeconds = ErrorLogSummary.setFromSeconds.bind(this);

        this.loadSummary = this.loadSummary.bind(this);
    }

    componentDidMount() {
        let shouldReload = false;
        const queryParams = queryString.parse(location.search);

        if (queryParams.fromSeconds === undefined) {
            queryParams.fromSeconds = 1800; // 30 minutes
            shouldReload = true;
        }

        if (shouldReload) {
            location.search = queryString.stringify(queryParams);
        } else {
            this.loadSummary();
        }
    }

    loadSummary() {
        const queryParams = queryString.parse(location.search);

        this.props.onSummary(queryParams);
    }

    static setFromSeconds(seconds) {
        const parsed = queryString.parse(location.search);
        parsed.fromSeconds = seconds;

        location.search = queryString.stringify(parsed);
    }

    render() {
        return (
            <div className="container-fluid">
                <div>
                    <ButtonToolbar>
                        <Button className='btn'
                                type='submit'
                                disabled={false}
                                onClick={() => {
                                    ErrorLogSummary.setFromSeconds(5 * 60)
                                }}>
                            5 minutter
                        </Button>
                        <Button className='btn'
                                type='submit'
                                disabled={false}
                                onClick={() => {
                                    ErrorLogSummary.setFromSeconds(30 * 60)
                                }}>
                            30 minutter
                        </Button>
                        <Button className='btn'
                                type='submit'
                                disabled={false}
                                onClick={() => {
                                    ErrorLogSummary.setFromSeconds(6 * 60 * 60)
                                }}>
                            6 timer
                        </Button>
                        <Button className='btn'
                                type='submit'
                                disabled={false}
                                onClick={() => {
                                    ErrorLogSummary.setFromSeconds(24 * 60 * 60)
                                }}>
                            1 dag
                        </Button>
                        <Button className='btn'
                                type='submit'
                                disabled={false}
                                onClick={() => {
                                    ErrorLogSummary.setFromSeconds(7 * 24 * 60 * 60)
                                }}
                                variant="primary">
                            7 dage
                        </Button>
                        <Button className='btn'
                                type='submit'
                                disabled={false}
                                onClick={() => {
                                    ErrorLogSummary.setFromSeconds(14 * 24 * 60 * 60)
                                }}
                                variant="primary">
                            14 dage
                        </Button>
                    </ButtonToolbar>
                </div>
                <hr/>
                <div>
                    {this.props.summaryData.map((item, key) =>
                        <ErrorLogSummaryElement item={item} key={key}/>
                    )}
                </div>
            </div>
        )
    }

}

export default ErrorLogSummary;
