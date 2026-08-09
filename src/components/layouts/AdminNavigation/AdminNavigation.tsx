import { useAuth } from '@/context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import './AdminNavigation.css';

export default function AdminNavigation() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  const adminMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['Admin', 'Operator'] },
    { path: '/orders', label: 'Orders', icon: '📦', roles: ['Admin', 'Operator', 'Courier'] },
    { path: '/customers', label: 'Customers', icon: '👥', roles: ['Admin', 'Operator'] },
    { path: '/users', label: 'Users', icon: '👤', roles: ['Admin'] },
  ];

  const filteredMenuItems = adminMenuItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  return (
    <nav className="admin-navigation">
      <div className="admin-navigation__header">
        <h2>Admin Panel</h2>
        <div className="admin-navigation__user">
          <span className="admin-navigation__user-name">{user?.full_name}</span>
          <span className="admin-navigation__user-role">{user?.role}</span>
        </div>
      </div>

      <ul className="admin-navigation__menu">
        {filteredMenuItems.map((item) => (
          <li key={item.path} className="admin-navigation__menu-item">
            <Link
              to={item.path}
              className={`admin-navigation__link ${
                isActive(item.path) ? 'admin-navigation__link--active' : ''
              }`}
            >
              <span className="admin-navigation__link__icon">{item.icon}</span>
              <span className="admin-navigation__link__label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="admin-navigation__footer">
        <button onClick={handleLogout} className="admin-navigation__logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}
