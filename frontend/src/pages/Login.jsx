import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch {
      setError('That username and password don’t match. Try again.');
    } finally { setBusy(false); }
  };

  return (
    <div className="wrap">
      <div className="form-page">
        <h1>Welcome back</h1>
        <p className="sub">Log in to manage your bookings and listings.</p>
        <form onSubmit={submit}>
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        <p className="alt">New here? <Link to="/register">Create an account</Link></p>
      </div>
    </div>
  );
}

export default Login;