import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('bookings');

  const load = () => {
    setLoading(true);
    Promise.all([api.get('bookings/'), api.get('enquiries/')])
      .then(([b, e]) => { setBookings(b.data); setEnquiries(e.data); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.delete(`bookings/${id}/`);
      load();
    } catch {
      alert('Could not cancel. Try again.');
    }
  };

  const fmt = (d) => new Date(d).toLocaleDateString('en-IN',
    { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) return <p className="empty">Loading…</p>;

  return (
    <div className="wrap">
      <div className="page-pad">
        <div className="dash-head">
          <h1>My activity</h1>
        </div>

        <div className="tabs">
          <button className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}>
            Bookings ({bookings.length})
          </button>
          <button className={tab === 'enquiries' ? 'active' : ''} onClick={() => setTab('enquiries')}>
            Enquiries ({enquiries.length})
          </button>
        </div>

        {tab === 'bookings' && (
          bookings.length === 0 ? (
            <p className="empty">
              No bookings yet. <Link to="/cars?type=rental">Find a car to rent</Link>
            </p>
          ) : (
            <div className="rows">
              {bookings.map(b => (
                <div className="row" key={b.id}>
                  <div>
                    <Link to={`/cars/${b.car}`} className="row-title">
                      {b.car_detail.year} {b.car_detail.make} {b.car_detail.model}
                    </Link>
                    <p className="meta">{fmt(b.start_date)} to {fmt(b.end_date)}</p>
                  </div>
                  <div className="row-right">
                    <span className={`status ${b.status}`}>{b.status}</span>
                    <p className="price">₹{Number(b.total_price).toLocaleString('en-IN')}</p>
                    {['pending', 'confirmed'].includes(b.status) && (
                      <div className="row-actions">
                        <button className="link-btn danger" onClick={() => cancel(b.id)}>
                          Cancel booking
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'enquiries' && (
          enquiries.length === 0 ? (
            <p className="empty">
              No enquiries yet. <Link to="/cars?type=resale">Browse used cars</Link>
            </p>
          ) : (
            <div className="rows">
              {enquiries.map(e => (
                <div className="row" key={e.id}>
                  <div>
                    <Link to={`/cars/${e.car}`} className="row-title">
                      {e.car_detail.year} {e.car_detail.make} {e.car_detail.model}
                    </Link>
                    <p className="meta">{e.message}</p>
                    <p className="meta">Sent {fmt(e.created_at)}</p>
                  </div>
                  <div className="row-right">
                    <span className={`status ${e.status}`}>{e.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default MyBookings;