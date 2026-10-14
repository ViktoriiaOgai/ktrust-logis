import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);

      // Перенаправление в зависимости от роли
      const userRole = user.role;
      let redirectUrl = '/';
      
      switch (userRole) {
        case 'User':
          redirectUrl = '/';
          break;
        case 'Operator':
          redirectUrl = '/operator';
          break;
        case 'Admin':
          redirectUrl = '/admin';
          break;
        case 'Courier':
          redirectUrl = '/courier';
          break;
        default:
          redirectUrl = '/';
      }

      navigate(redirectUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
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
          <p>CRM Система</p>
        </div>

        <form onSubmit={handleSubmit} className="login-page__form">
          <h2>Вход</h2>

          {error && <div className="login-page__error">{error}</div>}

          <div className="login-page__form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Введите ваш email"
            />
          </div>

          <div className="login-page__form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Введите ваш пароль"
            />
          </div>

          <button
            type="submit"
            className="login-page__submit-btn"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="login-page__footer">
          <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
        </div>
      </div>
    </div>
  );
}