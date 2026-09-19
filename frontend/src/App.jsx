import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CarListing from './pages/CarListing';
import CarDetail from './pages/CarDetail';

function App() {
  return (
    <div className="app">
      <nav className="nav">
        <Link to="/" className="logo">CarMarket</Link>
        <div className="nav-links">
          <Link to="/cars?type=rental">Rent</Link>
          <Link to="/cars?type=resale">Buy used</Link>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<CarListing />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="*" element={<p className="empty">Page not found.</p>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;