import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SearchProvider } from './context/SearchContext'
import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { App as AntdApp } from 'antd';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
  <AntdApp>
    <App />
  </AntdApp>
</React.StrictMode>,
)

