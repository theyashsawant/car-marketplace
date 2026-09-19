import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Home from './pages/Home';
import CarListing from './pages/CarListing';
import CarDetail from './pages/CarDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingForm from './pages/BookingForm';
import EnquiryForm from './pages/EnquiryForm';
import MyBookings from './pages/MyBookings';
import OwnerDashboard from './pages/OwnerDashboard';
import CarForm from './pages/CarForm';

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app">
      <nav className="nav">
        <Link to="/" className="logo">CarMarket</Link>
        <div className="nav-links">
          <Link to="/cars?type=rental">Rent</Link>
          <Link to="/cars?type=resale">Buy used</Link>
          {user ? (
            <>
              {(user.role === 'owner' || user.role === 'dealer') && (
                <Link to="/dashboard">My listings</Link>
              )}
              <Link to="/my-bookings">My bookings</Link>
              <span className="user">Hi, {user.username}</span>
              <button className="link-btn" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<CarListing />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book/:carId" element={
          <ProtectedRoute><BookingForm /></ProtectedRoute>
        } />
        <Route path="/enquire/:carId" element={
          <ProtectedRoute><EnquiryForm /></ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute><MyBookings /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>
        } />
        <Route path="/dashboard/car/new" element={
          <ProtectedRoute role="owner"><CarForm /></ProtectedRoute>
        } />
        <Route path="/dashboard/car/:id" element={
          <ProtectedRoute role="owner"><CarForm /></ProtectedRoute>
        } />
        <Route path="*" element={<p className="empty">Page not found.</p>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;