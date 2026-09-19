import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(query ? `/cars?search=${query}` : '/cars');
  };

  return (
    <div className="home">
      <h1>Find your next car</h1>
      <p className="sub">Rentals and quality used cars across Mumbai.</p>

      <div className="search">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Search by make or model"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="cta-row">
        <div className="cta" onClick={() => navigate('/cars?type=rental')}>
          <h3>Rent a car</h3>
          <p>Self-drive rentals by the day</p>
        </div>
        <div className="cta" onClick={() => navigate('/cars?type=resale')}>
          <h3>Buy a used car</h3>
          <p>Verified pre-owned listings</p>
        </div>
      </div>
    </div>
  );
}

export default Home;