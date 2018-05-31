import * as Redux = require('redux');

import { reducer } = require('./reducers';

export const store = Redux.createStore(reducer);
