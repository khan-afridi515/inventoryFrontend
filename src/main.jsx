import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/authContext.jsx'

import './index.css' 
import { EbayProvider } from './context/ebayContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EbayProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
    </EbayProvider>
  </React.StrictMode>,
)