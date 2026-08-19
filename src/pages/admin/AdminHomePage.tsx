import { Link } from 'react-router-dom';
import './AdminHomePage.css';

export default function AdminHomePage() {
  return (
    <div className="admin-home-page">
      <div className="admin-home-page__header">
        <h1>Панель администратора</h1>
        <p className="admin-home-page__subtitle">KTrust Logistics CRM Система</p>
      </div>

      <div className="admin-home-page__cards-grid">
        <Link to="/admin/dashboard" className="admin-home-page__card">
          <div className="admin-home-page__card__icon">📊</div>
          <h2 className="admin-home-page__card__title">Дашборд</h2>
          <p className="admin-home-page__card__description">
            Просмотр статистики, трендов и показателей эффективности
          </p>
        </Link>

        <Link to="/admin/orders" className="admin-home-page__card">
          <div className="admin-home-page__card__icon">📦</div>
          <h2 className="admin-home-page__card__title">Заказы</h2>
          <p className="admin-home-page__card__description">
            Управление всеми посылками и отслеживание отправлений
          </p>
        </Link>

        <Link to="/admin/customers" className="admin-home-page__card">
          <div className="admin-home-page__card__icon">👥</div>
          <h2 className="admin-home-page__card__title">Клиенты</h2>
          <p className="admin-home-page__card__description">
            Управление профилями и информацией о клиентах
          </p>
        </Link>

        <Link to="/admin/users" className="admin-home-page__card">
          <div className="admin-home-page__card__icon">👤</div>
          <h2 className="admin-home-page__card__title">Пользователи</h2>
          <p className="admin-home-page__card__description">
            Создание и управление аккаунтами администраторов и операторов
          </p>
        </Link>
      </div>

      <div className="admin-home-page__info-section">
        <h2>Быстрые действия</h2>
        <div className="admin-home-page__actions">
          <Link to="/admin/create-order" className="admin-home-page__action-btn">
            + Создать заказ
          </Link>
          <Link to="/admin/users" className="admin-home-page__action-btn">
            + Создать пользователя
          </Link>
        </div>
      </div>
    </div>
  );
}
