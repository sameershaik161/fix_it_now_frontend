import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Workers from './pages/Workers';
import WorkerProfile from './pages/WorkerProfile';
import CreateRequest from './pages/CreateRequest';
import MyRequests from './pages/MyRequests';
import RequestDetails from './pages/RequestDetails';
import WorkerDashboard from './pages/WorkerDashboard';
import Notifications from './pages/Notifications';
import Header from './components/Header';
import { AuthContext } from './context/AuthContext';

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

function WorkerRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user && user.role === 'worker' ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <div>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/workers/:id" element={<WorkerProfile />} />
          <Route path="/create-request" element={<PrivateRoute><CreateRequest /></PrivateRoute>} />
          <Route path="/my-requests" element={<PrivateRoute><MyRequests /></PrivateRoute>} />
          <Route path="/requests/:id" element={<PrivateRoute><RequestDetails /></PrivateRoute>} />
          <Route path="/worker-dashboard" element={<WorkerRoute><WorkerDashboard /></WorkerRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
}
