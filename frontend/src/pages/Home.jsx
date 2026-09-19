import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import HeroArt from './HeroArt';

const Icon = ({ d }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);

function Home() {
  const [mode, setMode] = useState('rental');
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('cars/').then(res => setCars(res.data.slice(0, 4))).catch(() => {});
  }, []);

  const search = () => {
    const p = new URLSearchParams({ type: mode });
    if (query) p.set('search', query);
    if (city) p.set('city', city);
    navigate(`/cars?${p}`);
  };

  return (
    <>
      <section className="hero">
        <HeroArt />
        <div className="wrap">
          <span className="hero-note">Mumbai · Thane · Navi Mumbai</span>
          <h1>Rent it by the day. Or buy it for good.</h1>
          <p>Self-drive cars and inspected pre-owned vehicles, ready when you are.</p>

          <div className="searchbox">
            <div className="sb-tabs">
              <button className={mode === 'rental' ? 'on' : ''} onClick={() => setMode('rental')}>
                Rent a car
              </button>
              <button className={mode === 'resale' ? 'on' : ''} onClick={() => setMode('resale')}>
                Buy a used car
              </button>
            </div>
            <div className="sb-body">
              <select value={city} onChange={e => setCity(e.target.value)}>
                <option>Mumbai</option>
                <option>Thane</option>
                <option>Navi Mumbai</option>
              </select>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
                placeholder="Search Swift, Ertiga, Kylaq…"
              />
              <button className="btn btn-primary" onClick={search}>Search cars</button>
            </div>
          </div>
        </div>
      </section>

      <section className="trustbar">
        <div className="wrap">
          <div className="trust">
            <Icon d={<><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></>} />
            <div><b>Every car reviewed</b><span>Listings are checked before they go live</span></div>
          </div>
          <div className="trust">
            <Icon d={<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>} />
            <div><b>Book by the day</b><span>No paperwork queues, no hidden charges</span></div>
          </div>
          <div className="trust">
            <Icon d={<><path d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6z"/></>} />
            <div><b>Verified owners</b><span>Sellers and partners are identity-checked</span></div>
          </div>
          <div className="trust">
            <Icon d={<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>} />
            <div><b>Mumbai-wide</b><span>Pickup points across the metro region</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Shop by budget</h2>
              <p>Pick a range and see what fits</p>
            </div>
            <Link to="/cars">Browse everything</Link>
          </div>
          <div className="tiles">
            <Link to="/cars?type=rental" className="tile">
              <b>Under ₹2,000</b><span>Daily rentals, hatchbacks</span>
            </Link>
            <Link to="/cars?type=rental" className="tile">
              <b>₹2,000 – ₹4,000</b><span>Sedans and compact SUVs</span>
            </Link>
            <Link to="/cars?type=resale" className="tile">
              <b>Under ₹5 lakh</b><span>First-car buys</span>
            </Link>
            <Link to="/cars?type=resale" className="tile">
              <b>₹5 – ₹10 lakh</b><span>Family seven-seaters</span>
            </Link>
          </div>
        </div>
      </section>

      {cars.length > 0 && (
        <section className="section alt">
          <div className="wrap">
            <div className="section-head">
              <div>
                <h2>Available right now</h2>
                <p>Fresh listings from our Mumbai fleet and partners</p>
              </div>
              <Link to="/cars">See all cars</Link>
            </div>
            <div className="grid">
              {cars.map(car => (
                <Link to={`/cars/${car.id}`} className="card" key={car.id}>
                  <div className="card-media">
                    {car.image_url
                      ? <img src={car.image_url} alt={`${car.make} ${car.model}`} />
                      : <span className="ph">Photo coming soon</span>}
                    <span className={`tag ${car.type === 'rental' ? 'rent' : ''}`}>
                      {car.type === 'rental' ? 'For rent' : 'Used car'}
                    </span>
                  </div>
                  <div className="card-body">
                    <h3>{car.year} {car.make} {car.model}</h3>
                    <ul className="chips">
                      <li>{car.fuel_type}</li>
                      <li>{car.transmission}</li>
                      <li>{car.seats} seats</li>
                    </ul>
                    <div className="card-foot">
                      <span className="price">
                        ₹{Number(car.price).toLocaleString('en-IN')}
                        {car.type === 'rental' && <span className="per"> /day</span>}
                      </span>
                      <span className="loc">{car.city}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>How it works</h2>
              <p>Three steps from browsing to driving</p>
            </div>
          </div>
          <div className="steps">
            <div className="step">
              <b>Find your car</b>
              <p>Filter by budget, fuel and transmission across rentals and resale listings.</p>
            </div>
            <div className="step">
              <b>Book or enquire</b>
              <p>Pick your dates for a rental, or send the seller a message about a used car.</p>
            </div>
            <div className="step">
              <b>Collect the keys</b>
              <p>We confirm your booking and share pickup details. Drive away the same day.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="band">
            <div>
              <h2>Have a car sitting idle?</h2>
              <p>List it on AK Enterprise and earn from it. We review every listing, so buyers and renters trust what they see.</p>
            </div>
            <Link to="/register" className="btn btn-primary">List your car</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;