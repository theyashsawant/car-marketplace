import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', phone: '', role: 'customer',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      const first = data && Object.values(data)[0];
      setError(Array.isArray(first) ? first[0] : 'We couldn’t create that account. Try again.');
    } finally { setBusy(false); }
  };

  return (
    <div className="wrap">
      <div className="form-page">
        <h1>Create your account</h1>
        <p className="sub">Book a rental, enquire about a used car, or list your own.</p>
        <form onSubmit={submit}>
          <label>Username</label>
          <input value={form.username} onChange={update('username')} required />
          <label>Email</label>
          <input type="email" value={form.email} onChange={update('email')} required />
          <label>Password</label>
          <input type="password" value={form.password} onChange={update('password')}
                 required minLength={8} />
          <label>Phone</label>
          <input value={form.phone} onChange={update('phone')} maxLength={15}
                 placeholder="10-digit mobile number" />
          <label>What brings you here?</label>
          <select value={form.role} onChange={update('role')}>
            <option value="customer">I want to rent or buy a car</option>
            <option value="owner">I want to list my car</option>
          </select>
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="alt">Already registered? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}

export default Register;