import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './login'
import Dashboard from './dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />  // Ensure this route is defined
      </Routes>
    </Router>
  )
}

export default App