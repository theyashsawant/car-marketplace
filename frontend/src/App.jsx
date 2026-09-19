import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Home from './pages/Home';
import CarListing from './pages/CarListing';
import CarDetail from './pages/CarDetail';
import Login from './pages/Login';
import Register from './pages/Register';

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
            <ProtectedRoute><p className="empty">Booking form comes in step 3.</p></ProtectedRoute>
          } />
          <Route path="*" element={<p className="empty">Page not found.</p>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;