import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import Splash, { shouldShowSplash } from './components/Splash/Splash'

function Root() {
  const [showSplash, setShowSplash] = useState(shouldShowSplash)

  return (
    <ThemeProvider>
      <LanguageProvider>
        {showSplash && <Splash onFinish={() => setShowSplash(false)} />}
        <App />
      </LanguageProvider>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
