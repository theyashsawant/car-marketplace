import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api';

function CarListing() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const type = searchParams.get('type') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    setLoading(true);
    api.get('cars/', { params: { type: type || undefined, search: search || undefined } })
      .then(res => setCars(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [type, search]);

  const setType = (value) => {
    const next = {};
    if (value) next.type = value;
    if (search) next.search = search;
    setSearchParams(next);
  };

  return (
    <div className="listing">
      <div className="tabs">
        <button className={type === '' ? 'active' : ''} onClick={() => setType('')}>All</button>
        <button className={type === 'rental' ? 'active' : ''} onClick={() => setType('rental')}>Rentals</button>
        <button className={type === 'resale' ? 'active' : ''} onClick={() => setType('resale')}>Used cars</button>
      </div>

      {search && <p className="sub">Results for "{search}"</p>}

      {loading ? (
        <p className="empty">Loading…</p>
      ) : cars.length === 0 ? (
        <p className="empty">No cars match your filters.</p>
      ) : (
        <div className="grid">
          {cars.map(car => (
            <Link to={`/cars/${car.id}`} key={car.id} className="card">
              <div className="card-img">
                {car.image_url
                  ? <img src={car.image_url} alt={`${car.make} ${car.model}`} />
                  : <span>No photo</span>}
              </div>
              <div className="card-body">
                <span className="badge">{car.type === 'rental' ? 'Rental' : 'Used'}</span>
                <h3>{car.year} {car.make} {car.model}</h3>
                <p className="meta">{car.fuel_type} · {car.transmission} · {car.city}</p>
                <p className="price">
                  ₹{Number(car.price).toLocaleString('en-IN')}
                  {car.type === 'rental' && <span className="per"> / day</span>}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default CarListing;