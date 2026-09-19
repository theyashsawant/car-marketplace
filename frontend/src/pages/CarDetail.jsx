import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';

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
  if (!car) return <p className="empty">Car not found.</p>;

  const isRental = car.type === 'rental';

  return (
    <div className="detail">
      <Link to="/cars" className="back">← Back to listings</Link>

      <div className="detail-grid">
        <div className="detail-img">
          {car.image_url
            ? <img src={car.image_url} alt={`${car.make} ${car.model}`} />
            : <span>No photo</span>}
        </div>

        <div>
          <span className="badge">{isRental ? 'Rental' : 'Used car'}</span>
          <h1>{car.year} {car.make} {car.model}</h1>
          <p className="price big">
            ₹{Number(car.price).toLocaleString('en-IN')}
            {isRental && <span className="per"> / day</span>}
          </p>

          <table className="specs">
            <tbody>
              <tr><td>Fuel</td><td>{car.fuel_type}</td></tr>
              <tr><td>Transmission</td><td>{car.transmission}</td></tr>
              <tr><td>Seats</td><td>{car.seats}</td></tr>
              <tr><td>KM driven</td><td>{Number(car.km_driven).toLocaleString('en-IN')}</td></tr>
              <tr><td>City</td><td>{car.city}</td></tr>
            </tbody>
          </table>

          {car.description && <p className="desc">{car.description}</p>}

          <button className="primary"
        onClick={() => navigate(isRental ? `/book/${car.id}` : `/enquire/${car.id}`)}>
  {isRental ? 'Book this car' : 'Enquire now'}
</button>
        </div>
      </div>
    </div>
  );
}

export default CarDetail;