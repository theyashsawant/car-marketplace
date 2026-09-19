import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

const BLANK = {
  type: 'rental', make: '', model: '', year: new Date().getFullYear(),
  price: '', fuel_type: 'petrol', transmission: 'manual',
  km_driven: 0, seats: 5, city: 'Mumbai', description: '', image_url: '',
};

function CarForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`cars/${id}/`)
      .then(res => setForm({ ...BLANK, ...res.data }))
      .catch(() => setError('Could not load this listing.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (isEdit) await api.put(`cars/${id}/`, form);
      else await api.post('cars/', form);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      const first = data && (data.detail || Object.values(data)[0]);
      setError(Array.isArray(first) ? first[0] : (first || 'Could not save. Try again.'));
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="empty">Loading…</p>;

  return (
    <div className="wrap">
      <div className="form-page wide">
        <p className="crumb"><Link to="/dashboard">Back to my listings</Link></p>
        <h1>{isEdit ? 'Edit listing' : 'List a car'}</h1>
        <p className="sub">Our team reviews every listing before it appears on the site.</p>

        <form onSubmit={submit}>
          <label>Listing type</label>
          <select value={form.type} onChange={update('type')}>
            <option value="rental">Rental — priced per day</option>
            <option value="resale">Used car — for sale</option>
          </select>

          <div className="two-col">
            <div>
              <label>Make</label>
              <input value={form.make} onChange={update('make')} placeholder="Suzuki" required />
            </div>
            <div>
              <label>Model</label>
              <input value={form.model} onChange={update('model')} placeholder="Swift" required />
            </div>
          </div>

          <div className="two-col">
            <div>
              <label>Registration year</label>
              <input type="number" min="1990" max="2030"
                     value={form.year} onChange={update('year')} required />
            </div>
            <div>
              <label>{form.type === 'rental' ? 'Price per day (₹)' : 'Asking price (₹)'}</label>
              <input type="number" min="0" step="0.01"
                     value={form.price} onChange={update('price')} required />
            </div>
          </div>

          <div className="two-col">
            <div>
              <label>Fuel</label>
              <select value={form.fuel_type} onChange={update('fuel_type')}>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="cng">CNG</option>
                <option value="electric">Electric</option>
              </select>
            </div>
            <div>
              <label>Transmission</label>
              <select value={form.transmission} onChange={update('transmission')}>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>
          </div>

          <div className="two-col">
            <div>
              <label>Kilometres driven</label>
              <input type="number" min="0" value={form.km_driven} onChange={update('km_driven')} />
            </div>
            <div>
              <label>Seats</label>
              <input type="number" min="2" max="10" value={form.seats} onChange={update('seats')} />
            </div>
          </div>

          <label>City</label>
          <input value={form.city} onChange={update('city')} required />

          <label>Photo URL</label>
          <input value={form.image_url || ''} onChange={update('image_url')}
                 placeholder="https://example.com/car.jpg" />

          <label>Description</label>
          <textarea rows={3} value={form.description} onChange={update('description')}
                    placeholder="Single owner, full service history, new tyres…" />

          {error && <p className="error">{error}</p>}

          <p className="hint">
            New and edited listings go for review before they appear on the site.
          </p>

          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Submit for review'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CarForm;