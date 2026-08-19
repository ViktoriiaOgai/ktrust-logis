import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CourierDashboard.css';

export default function CourierDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="courier-dashboard">
      <div className="courier-dashboard__header">
        <h1>Панель курьера</h1>
        <div className="courier-dashboard__user-info">
          <span>{user?.full_name}</span>
          <button onClick={handleLogout} className="courier-dashboard__logout-btn">
            Выйти
          </button>
        </div>
      </div>

      <div className="courier-dashboard__content">
        <div className="courier-dashboard__menu">
          <button onClick={() => navigate('/orders')} className="courier-dashboard__menu-item">
            📦 Мои заказы
          </button>
        </div>

        <div className="courier-dashboard__info">
          <h2>Добро пожаловать, {user?.full_name}!</h2>
          <p>Вы вошли как курьер.</p>
          <p>Просмотрите назначенные заказы и обновите статус доставки.</p>
        </div>
      </div>
    </div>
  );
}
