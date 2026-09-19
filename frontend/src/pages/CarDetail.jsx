import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Tick = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`cars/${id}/`)
      .then(res => setCar(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="empty">Loading…</p>;
  if (!car) return <p className="empty">This car is no longer listed.</p>;

  const isRental = car.type === 'rental';

  return (
    <div className="wrap">
      <div className="detail">
        <p className="crumb">
          <Link to="/">Home</Link> / <Link to="/cars">Cars</Link> / {car.make} {car.model}
        </p>

        <div className="detail-grid">
          <div>
            <div className="gallery">
              {car.image_url
                ? <img src={car.image_url} alt={`${car.make} ${car.model}`} />
                : <span className="ph">Photo coming soon</span>}
            </div>

            <div className="spec-grid">
              <div><dt>Fuel</dt><dd>{car.fuel_type}</dd></div>
              <div><dt>Transmission</dt><dd>{car.transmission}</dd></div>
              <div><dt>Seats</dt><dd>{car.seats}</dd></div>
              <div><dt>Kilometres driven</dt><dd>{Number(car.km_driven).toLocaleString('en-IN')} km</dd></div>
              <div><dt>Registration year</dt><dd>{car.year}</dd></div>
              <div><dt>Location</dt><dd>{car.city}</dd></div>
            </div>

            {car.description && <p className="desc">{car.description}</p>}
          </div>

          <div className="buybox">
            <span className={`tag ${isRental ? 'rent' : ''}`} style={{ position: 'static' }}>
              {isRental ? 'For rent' : 'Used car'}
            </span>
            <h1>{car.year} {car.make} {car.model}</h1>
            <span className="price big">
              ₹{Number(car.price).toLocaleString('en-IN')}
              {isRental && <span className="per"> /day</span>}
            </span>

            <button className="btn btn-primary btn-block"
                    onClick={() => navigate(isRental ? `/book/${car.id}` : `/enquire/${car.id}`)}>
              {isRental ? 'Check availability' : 'Contact the seller'}
            </button>

            <ul className="points">
              <li><Tick /> Reviewed by our team before listing</li>
              <li><Tick /> {isRental ? 'No security deposit on most rentals' : 'Full service history shared on request'}</li>
              <li><Tick /> Pickup across {car.city}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarDetail;