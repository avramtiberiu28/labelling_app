import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './pages/auth/components/AuthContext';
import Login from './pages/auth/login';
import Home from './pages/home/home';
import './App.css'
//import 'bootstrap/dist/css/bootstrap.min.css';
import './globals';


function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return children;
  }

  return <Navigate to="/login" />;
}

function App() {

  return (
    <Router>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          </Routes>
        </AuthProvider>
      </Router>
  )
}

export default App
