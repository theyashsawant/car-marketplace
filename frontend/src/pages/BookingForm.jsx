import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

function BookingForm() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    api.get(`cars/${carId}/`)
      .then(res => setCar(res.data))
      .catch(() => setError('Could not load this car.'))
      .finally(() => setLoading(false));
  }, [carId]);

  const days = start && end
    ? Math.max(0, (new Date(end) - new Date(start)) / 86400000)
    : 0;
  const total = car ? days * Number(car.price) : 0;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('bookings/', {
        car: carId,
        start_date: start,
        end_date: end,
      });
      navigate('/my-bookings');
    } catch (err) {
      const data = err.response?.data;
      const first = data && (data.non_field_errors || Object.values(data)[0]);
      setError(Array.isArray(first) ? first[0] : 'Booking failed. Try again.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="empty">Loading…</p>;
  if (!car) return <p className="empty">Car not found.</p>;

  return (
    <div className="form-page wide">
      <Link to={`/cars/${carId}`} className="back">← Back to car</Link>
      <h1>Book this car</h1>

      <div className="summary">
        <strong>{car.year} {car.make} {car.model}</strong>
        <span>₹{Number(car.price).toLocaleString('en-IN')} / day</span>
      </div>

      <form onSubmit={submit}>
        <label>Pick-up date</label>
        <input type="date" min={today} value={start}
               onChange={e => setStart(e.target.value)} required />

        <label>Return date</label>
        <input type="date" min={start || today} value={end}
               onChange={e => setEnd(e.target.value)} required />

        {days > 0 && (
          <div className="total-box">
            <span>{days} {days === 1 ? 'day' : 'days'}</span>
            <strong>₹{total.toLocaleString('en-IN')}</strong>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <button className="primary" disabled={busy || days < 1}>
          {busy ? 'Confirming…' : 'Confirm booking'}
        </button>
      </form>
    </div>
  );
}

export default BookingForm;