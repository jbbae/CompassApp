import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
//import { createHashHistory } from 'history';
import injectTapEventPlugin from 'react-tap-event-plugin';

//Needed for React Developer Tools
window.React = React;

injectTapEventPlugin();

import App from './Main';
//import Landing from './pages/Landing';
//import Dashboard from './pages/Dashboard';
//import Profile from './pages/Profile';
//import HowWorks from './pages/HowWorks';

//import ExplorerWithNav from './pages/Explorerwithnav';
//import ExplorerDescription from './pages/ExplorerDescription';

//Integrate later - temporary detatch
//<IndexRoute component={Landing} />
//<Route path="dashboard" component={Dashboard} />
//<Route path="profile" component={Profile} />
//<Route path="howworks" component={HowWorks} />

//<Route path="explorerwithnav" component={ExplorerWithNav}>
//<Route path="explorerdescription" component={ExplorerDescription} />
//</Route>

// Render the main component into the dom
ReactDOM.render((
  <Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>
    <Route path="/" component={App}>
    </Route>
  </Router>

), document.getElementById('app'));
