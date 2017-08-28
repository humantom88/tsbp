import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { browserHistory, Link, Route, IndexRoute, Router } from 'react-router'
import { App } from './route-handlers/app'
import { Main } from './route-handlers/main'

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Main} />
        </Route>
    </Router>,
    document.getElementById("example")
);