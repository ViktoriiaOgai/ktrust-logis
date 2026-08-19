import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './OperatorDashboard.css';

export default function OperatorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="operator-dashboard">
      <div className="operator-dashboard__header">
        <h1>Панель оператора</h1>
        <div className="operator-dashboard__user-info">
          <span>{user?.full_name}</span>
          <button onClick={handleLogout} className="operator-dashboard__logout-btn">
            Выйти
          </button>
        </div>
      </div>

      <div className="operator-dashboard__content">
        <div className="operator-dashboard__menu">
          <button onClick={() => navigate('/orders')} className="operator-dashboard__menu-item">
            📦 Заказы
          </button>
          <button onClick={() => navigate('/customers')} className="operator-dashboard__menu-item">
            👥 Клиенты
          </button>
          <button onClick={() => navigate('/create-order')} className="operator-dashboard__menu-item">
            ➕ Создать заказ
          </button>
        </div>

        <div className="operator-dashboard__info">
          <h2>Добро пожаловать, {user?.full_name}!</h2>
          <p>Вы вошли как оператор.</p>
          <p>Выберите опцию из меню для начала работы.</p>
        </div>
      </div>
    </div>
  );
}
