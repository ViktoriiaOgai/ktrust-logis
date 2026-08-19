import { useNavigate } from 'react-router-dom';
import './AccessDeniedPage.css';

export default function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <div className="access-denied-page">
      <div className="access-denied-page__container">
        <div className="access-denied-page__icon">🚫</div>
        <h1 className="access-denied-page__title">Доступ запрещен</h1>
        <p className="access-denied-page__message">
          У вас нет прав для доступа к этой странице.
        </p>
        <div className="access-denied-page__actions">
          <button
            onClick={() => navigate(-1)}
            className="access-denied-page__btn access-denied-page__btn--back"
          >
            Назад
          </button>
          <button
            onClick={() => navigate('/')}
            className="access-denied-page__btn access-denied-page__btn--dashboard"
          >
            На главную
          </button>
        </div>
      </div>
    </div>
  );
}
