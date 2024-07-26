import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import ConetxtProvider from "./contextApi/ConetxtProvider.jsx";
import { createBrowserHistory } from 'history';
const customHistory = createBrowserHistory();
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter history={customHistory}>
 <ConetxtProvider>

    <App />

    </ConetxtProvider>
  </BrowserRouter>
)
