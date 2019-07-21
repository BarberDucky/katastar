import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Switch, Route } from 'react-router-dom'
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import configureStore, { history } from './store/reducers';
import { ConnectedRouter } from 'connected-react-router';

const store = configureStore()

const Root = () => (
    <Provider store = {store}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route exact path="/" component={App} />
            </Switch>
        </ConnectedRouter>
    </Provider>
)

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
