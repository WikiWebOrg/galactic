/**
 * Copyright (c) 2016, Galactic
*/
// Home Index File


import ReactDOM from "react-dom";
import React from "react";
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import homeApp from './reducers'

import Home from './containers/HomeSearch.react'

import thunkMiddleware from 'redux-thunk'
let store = createStore(
  homeApp,
  applyMiddleware(thunkMiddleware)
)

ReactDOM.render(
  (<Provider store={store}>
    <Home />
  </Provider>),
  document.getElementById('app')
);
