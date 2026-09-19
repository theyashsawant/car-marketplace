import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

function EnquiryForm() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get(`cars/${carId}/`)
      .then(res => setCar(res.data))
      .catch(() => setError('Could not load this car.'))
      .finally(() => setLoading(false));
  }, [carId]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('enquiries/', {
        car: carId,
        message,
        contact_phone: phone,
      });
      navigate('/my-bookings');
   } catch (err) {
     const data = err.response?.data;
    const first = data && (data.non_field_errors || Object.values(data)[0]);
    setError(Array.isArray(first) ? first[0] : 'Could not send your enquiry. Try again.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="empty">Loading…</p>;
  if (!car) return <p className="empty">Car not found.</p>;

  return (
    <div className="form-page wide">
      <Link to={`/cars/${carId}`} className="back">← Back to car</Link>
      <h1>Enquire about this car</h1>

      <div className="summary">
        <strong>{car.year} {car.make} {car.model}</strong>
        <span>₹{Number(car.price).toLocaleString('en-IN')}</span>
      </div>

      <form onSubmit={submit}>
        <label>Your message</label>
        <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Is this still available? Can I see it this weekend?" required />

        <label>Contact number</label>
        <input value={phone} onChange={e => setPhone(e.target.value)}
               placeholder="Optional" />

        {error && <p className="error">{error}</p>}

        <button className="primary" disabled={busy}>
          {busy ? 'Sending…' : 'Send enquiry'}
        </button>
      </form>
    </div>
  );
}

export default EnquiryForm;