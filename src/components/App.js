import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './Signup';
import Dashboard from './Dashboard';
import Login from './Login';
import Lost from './Lost';
import PrivateRoute from './PrivateRoute';
import ForgotPW from './ForgotPW';
import UpdateProfile from './UpdateProfile';
import './tempstyles.css'

function App() {
  return (
    <Router>
      <section>
        <AuthProvider>
          <Routes>
            <Route exact path='/' element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route exact path='/update-profile' element={
              <PrivateRoute>
                <UpdateProfile />
              </PrivateRoute>
            } />

            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPW />} />
            <Route path="/*" element={<Lost />} />
          </Routes>
        </AuthProvider>
      </section>
    </Router>

  );
}

export default App;
