import { Meteor } from 'meteor/meteor';
import React from 'react';
//import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
//import {Tracker} from 'meteor/tracker';

import Signup from '../ui/Signup';
import Link from '../ui/Link';
import NotFound from '../ui/NotFound';
import Login from '../ui/Login';

const unauthenticatedPages = ['/', '/signup'];
const authenticatedPages = ['/links'];

const onEnterPublicPage = () => {
  if (Meteor.userId()) {
    browserHistory.replace('/links');
  }
};

onEnterPrivatePage = () => {
  if (!Meteor.userId()) {
    browserHistory.replace('/');
  }
};

export const onAuthChange = (isAuthenticated) => {
    const pathname = browserHistory.getCurrentLocation().pathname;
    const isUnauthenticatedPage = unauthenticatedPages.includes(pathname);
    const isAuthenticatedPage = authenticatedPages.includes(pathname);

    //If on an unAthenticated page and logged in redirect to links
    //browserHistory.push
    //If on an authenticaed page and not logged in the redirect to '/'
    //browserHistory.push
    if (isUnauthenticatedPage && isAuthenticated) {
    browserHistory.replace('links');
    } else if (isAuthenticatedPage && !isAuthenticated) {
    browserHistory.replace('/');
    }

    //console.log('isAuthenticated', isAuthenticated)
}

export const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Login} onEnter={onEnterPublicPage}/>
    <Route path="/signup" component={Signup} onEnter={onEnterPublicPage}/>
    <Route path="/links" component={Link} onEnter={onEnterPrivatePage}/>
    <Route path="*" component={NotFound}/>
  </Router>
);