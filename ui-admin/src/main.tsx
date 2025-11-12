import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import 'antd/dist/reset.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider theme={{ components: { Button: { fontSize: 14 } } }} componentSize="small">
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)
