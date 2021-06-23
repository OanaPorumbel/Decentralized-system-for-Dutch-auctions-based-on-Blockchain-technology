import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import web3Reducer from './reducer/web3Reducer';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userReducer from './reducer/userReducer';
import nftReducer from './reducer/nftReducer';
import timeReducer from './reducer/timeReducer';

const store = configureStore({
  reducer: {
    web3: web3Reducer,
    user: userReducer,
    nft: nftReducer,
    timer: timeReducer
  }
})

ReactDOM.render(
  <Provider store = {store}>
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
