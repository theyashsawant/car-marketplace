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

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      const first = data && Object.values(data)[0];
      setError(Array.isArray(first) ? first[0] : 'Registration failed. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="form-page">
      <h1>Create an account</h1>
      <form onSubmit={submit}>
        <label>Username</label>
        <input value={form.username} onChange={update('username')} required />

        <label>Email</label>
        <input type="email" value={form.email} onChange={update('email')} required />

        <label>Password</label>
        <input type="password" value={form.password} onChange={update('password')} required minLength={8} />

        <label>Phone</label>
        <input value={form.phone} onChange={update('phone')} />

        <label>I want to</label>
        <select value={form.role} onChange={update('role')}>
          <option value="customer">Rent or buy a car</option>
          <option value="owner">List my car</option>
        </select>

        {error && <p className="error">{error}</p>}

        <button className="primary" disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="alt">Already registered? <Link to="/login">Log in</Link></p>
    </div>
  );
}

export default Register;