import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api';

function CarListing() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('new');
  const [params, setParams] = useSearchParams();

  const type = params.get('type') || '';
  const search = params.get('search') || '';
  const fuel = params.get('fuel') || '';

  useEffect(() => {
    setLoading(true);
    api.get('cars/', { params: { type: type || undefined, search: search || undefined } })
      .then(res => setCars(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [type, search]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next);
  };

  let shown = fuel ? cars.filter(c => c.fuel_type === fuel) : cars;
  shown = [...shown].sort((a, b) =>
    sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : b.id - a.id
  );

  const Opt = ({ group, value, label }) => (
    <label className={`fopt ${params.get(group) === value ? 'on' : ''}`}>
      <input type="radio" name={group} checked={params.get(group) === value}
             onChange={() => setParam(group, value)} />
      {label}
    </label>
  );

  return (
    <div className="wrap">
      <div className="shop">
        <aside className="filters">
          <div className="fgroup">
            <h4>Listing type</h4>
            <label className={`fopt ${!type ? 'on' : ''}`}>
              <input type="radio" name="type" checked={!type}
                     onChange={() => setParam('type', '')} />
              All cars
            </label>
            <Opt group="type" value="rental" label="For rent" />
            <Opt group="type" value="resale" label="Used cars" />
          </div>

          <div className="fgroup">
            <h4>Fuel</h4>
            <label className={`fopt ${!fuel ? 'on' : ''}`}>
              <input type="radio" name="fuel" checked={!fuel}
                     onChange={() => setParam('fuel', '')} />
              Any fuel
            </label>
            <Opt group="fuel" value="petrol" label="Petrol" />
            <Opt group="fuel" value="diesel" label="Diesel" />
            <Opt group="fuel" value="cng" label="CNG" />
            <Opt group="fuel" value="electric" label="Electric" />
          </div>
        </aside>

        <div>
          <div className="results-head">
            <div>
              <h1>
                {type === 'rental' ? 'Cars for rent'
                  : type === 'resale' ? 'Used cars for sale'
                  : 'All cars'}
              </h1>
              <span>
                {loading ? 'Loading…' : `${shown.length} car${shown.length === 1 ? '' : 's'} available`}
                {search && ` for “${search}”`}
              </span>
            </div>
            <select className="sortsel" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="new">Newest first</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>

          {loading ? (
            <p className="empty">Loading cars…</p>
          ) : shown.length === 0 ? (
            <p className="empty">
              Nothing matches those filters yet. <Link to="/cars">Clear filters</Link>
            </p>
          ) : (
            <div className="grid">
              {shown.map(car => (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default CarListing;