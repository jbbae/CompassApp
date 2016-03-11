import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

//Needed for React Developer Tools
window.React = React;

injectTapEventPlugin();

import App from './Main';
import Landing from './pages/Landing';
//import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import HowWorks from './pages/HowWorks';

import ExplorerWithNav from './pages/Explorerwithnav';
import ExplorerDescription from './pages/ExplorerDescription';

//Integrate later - temporary detatch
//<Route path="dashboard" component={Dashboard} />

// Render the main component into the dom
ReactDOM.render((
  <Router history={hashHistory} onUpdate={() => window.scrollTo(0, 0)}>
    <Route path="/" component={App}>
      <IndexRoute component={Landing} />
      <Route path="howworks" component={HowWorks} />
      <Route path="profile" component={Profile} />
      <Route path="explorerwithnav" component={ExplorerWithNav}>
        <Route path="explorerdescription" component={ExplorerDescription} />
      </Route>
    </Route>
  </Router>

), document.getElementById('app'));
