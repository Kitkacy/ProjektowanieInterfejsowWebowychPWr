import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App, { Layout } from './root'
import './index.css'
import initializeFirestore from './firebase/init'

console.log('Main.jsx is executing')

initializeFirestore()
  .then(() => console.log('Firestore initialization completed'))
  .catch(error => console.error('Firestore initialization failed:', error));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Layout>
          <App />
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)