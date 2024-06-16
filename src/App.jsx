import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import Publications from './pages/Publications';
import Conferences from './pages/Conferences';
import ContactUs from './pages/ContactUs'
import ProtectedRoute from './components/protectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if(token)
  //     setIsAuthenticated(true);
  // }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/publication/:publicationId" element={<Publications />} />
        <Route path="/conference/:conferenceId" element={<Conferences />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;