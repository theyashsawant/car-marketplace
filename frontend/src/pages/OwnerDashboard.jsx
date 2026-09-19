import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function OwnerDashboard() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('cars/my-cars/')
      .then(res => setCars(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return;
    try {
      await api.delete(`cars/${id}/`);
      load();
    } catch {
      alert('Could not delete. Try again.');
    }
  };

  if (loading) return <p className="empty">Loading…</p>;

  return (
    <div className="listing">
      <div className="dash-head">
        <h1 className="page-title">My listings</h1>
        <Link to="/dashboard/car/new" className="primary btn-link">+ Add a car</Link>
      </div>

      {cars.length === 0 ? (
        <p className="empty">
          You haven't listed any cars yet.{' '}
          <Link to="/dashboard/car/new">Add your first one</Link>
        </p>
      ) : (
        <div className="rows">
          {cars.map(car => (
            <div className="row" key={car.id}>
              <div>
                <span className="row-title">
                  {car.year} {car.make} {car.model}
                </span>
                <p className="meta">
                  {car.type === 'rental' ? 'Rental' : 'Used car'} ·
                  ₹{Number(car.price).toLocaleString('en-IN')}
                  {car.type === 'rental' && ' / day'} · {car.city}
                </p>
                {car.status === 'rejected' && car.rejection_reason && (
                  <p className="reject-note">Reason: {car.rejection_reason}</p>
                )}
              </div>
              <div className="row-right">
                <span className={`status ${car.status}`}>
                  {car.status === 'pending' ? 'Pending review' : car.status}
                </span>
                <div className="row-actions">
                  <Link to={`/dashboard/car/${car.id}`} className="link-btn">Edit</Link>
                  <button className="link-btn danger inline"
                          onClick={() => remove(car.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;