import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import Reducer from './reducers/reducer.js';
import { Provider } from 'react-redux';
import Async from './components/Async.js';
import createSagaMiddleware from "redux-saga";
import saga from './saga/saga.js';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
	Reducer,
	applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(saga);
ReactDOM.render(
	<Provider store={ store }>
		<Async />
	</Provider>, 
	document.getElementById('root')
);


