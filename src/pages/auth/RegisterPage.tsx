import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '@/services/api';
import './LoginPage.css';

// Описываем интерфейс ответа от сервера
interface RegisterResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    role?: string;
  };
  token: string;
}

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Приводим response.data к описанному типу с помощью "as"
      const response = await apiClient.post('/api/auth/register', {
        fullName,
        email,
        password,
      });

      const { user, token } = response.data as RegisterResponse;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      apiClient.setToken(token);
      
      navigate('/dashboard');
    } catch (err: any) {
      // Обработка ошибки с поддержкой Axios / custom error
      const message =
        err?.response?.data?.message ||
        (err instanceof Error ? err.message : 'Registration failed');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__header">
          <h1>KTrust Logistics</h1>
          <p>CRM System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-page__form">
          <h2>Register</h2>

          {error && <div className="login-page__error">{error}</div>}

          <div className="login-page__form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="login-page__form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="login-page__form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password (min 8 characters)"
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="login-page__submit-btn"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="login-page__footer">
          {/* Используем Link из react-router-dom вместо обычного <a> */}
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}