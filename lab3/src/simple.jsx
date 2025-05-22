import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const App = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#16a34a', marginBottom: '20px' }}>Books4Cash.io</h1>
      <p>Your app is now running in Client-Side Rendering mode!</p>
      <div style={{ marginTop: '20px' }}>
        <a 
          href="https://github.com/your-username/ProjektowanieInterfejsowWebowychPWr"
          style={{ 
            background: '#16a34a',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            textDecoration: 'none'
          }}
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
