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
  const isOwner = user && (user.role === 'owner' || user.role === 'dealer');

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <span>Serving Mumbai, Thane and Navi Mumbai</span>
          <span>Support <strong>+91 98765 43210</strong></span>
        </div>
      </div>

      <header className="header">
        <div className="wrap">
          <Link to="/" className="logo">
            <span className="logo-mark">AK</span>
            <span>AK Enterprise<small>RENTALS &amp; USED CARS</small></span>
          </Link>
          <nav className="nav-links">
            <Link to="/cars?type=rental">Rent a car</Link>
            <Link to="/cars?type=resale">Buy used</Link>
            {user ? (
              <>
                {isOwner && <Link to="/dashboard">My listings</Link>}
                <Link to="/my-bookings">My bookings</Link>
                <span className="who">
                  <span className="avatar">{user.username.slice(0, 2)}</span>
                  <span>{user.username}</span>
                </span>
                <button className="link-btn" onClick={() => { logout(); navigate('/'); }}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Log in</Link>
                <Link to="/register" className="btn btn-dark btn-sm">Get started</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<CarListing />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book/:carId" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} />
          <Route path="/enquire/:carId" element={<ProtectedRoute><EnquiryForm /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/car/new" element={<ProtectedRoute role="owner"><CarForm /></ProtectedRoute>} />
          <Route path="/dashboard/car/:id" element={<ProtectedRoute role="owner"><CarForm /></ProtectedRoute>} />
          <Route path="*" element={<p className="empty">Page not found.</p>} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <Link to="/" className="logo" style={{ color: '#fff' }}>
                <span className="logo-mark">AK</span>
                <span>AK Enterprise</span>
              </Link>
              <p className="brandline">
                Self-drive rentals and inspected used cars across Mumbai.
                Every listing is reviewed by our team before it goes live.
              </p>
            </div>
            <div>
              <h4>Rent</h4>
              <ul>
                <li><Link to="/cars?type=rental">All rentals</Link></li>
                <li><Link to="/cars?type=rental">Weekend hire</Link></li>
                <li><Link to="/cars?type=rental">Monthly plans</Link></li>
              </ul>
            </div>
            <div>
              <h4>Buy</h4>
              <ul>
                <li><Link to="/cars?type=resale">All used cars</Link></li>
                <li><Link to="/cars?type=resale">Under ₹5 lakh</Link></li>
                <li><Link to="/cars?type=resale">Seven seaters</Link></li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li><Link to="/register">Sell your car</Link></li>
                <li><Link to="/login">Partner login</Link></li>
                <li><a href="mailto:hello@akenterprise.in">Contact us</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} AK Enterprise. Mumbai, Maharashtra.</span>
            <span>Terms · Privacy · Refunds</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;