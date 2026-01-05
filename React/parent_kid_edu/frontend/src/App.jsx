import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import './styles/app.css'

//登陆注册页面组件
const AuthPage = () =>{
  return (
    <div className="app-root">
      <div className="cartoon-bg">
        <Login />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  )
}
