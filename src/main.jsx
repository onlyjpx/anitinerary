import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import 'bootstrap/dist/css/bootstrap.min.css';

const clientId = "894459726309-20fo5om0q4m1u9kn303cr3mbim1gni25.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId={clientId}
      onScriptLoadError={() => console.log('Erro ao carregar script Google')}
      onScriptLoadSuccess={() => console.log('Script Google carregado')}
    >
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
)
