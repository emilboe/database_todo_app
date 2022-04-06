import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './Signup + Login/Signup';
import Handleliste from './ShopList';
import Login from './Signup + Login/Login';
import Lost from './Lost';
import PrivateRoute from './PrivateRoute';
import ForgotPW from './Signup + Login/ForgotPW';
import Profile from './Profile/Profile';
import UpdateProfile from './UpdateProfile';
import Fridge from './Fridge/Fridge';
import NavBar from './NavBar/NavBar';
import Groups from './Groups'
import './globals.css'

function App() {

  console.log(useAuth())
  return (
    <Router>
      <section>
        <AuthProvider>
          <NavBar />
          <Routes>
            <Route exact path='/' element={
              <PrivateRoute>
                <Handleliste />
              </PrivateRoute>
            } />
            <Route exact path='/update-profile' element={
              <PrivateRoute>
                <UpdateProfile />
              </PrivateRoute>
            } />
            <Route exact path='/profile' element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route exact path='/fridge' element={
              <PrivateRoute>
                <Fridge />
              </PrivateRoute>
            } />
            <Route exact path='/groups' element={
              <PrivateRoute>
                <Groups />
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
