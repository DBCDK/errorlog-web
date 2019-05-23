/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 * See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

const React = require("react");
const ReactDOM = require("react-dom");
import ErrorlogGui from './components/errorlog-gui';

ReactDOM.render(
<ErrorlogGui/>,
    document.getElementById('errorlog-web-root')
);