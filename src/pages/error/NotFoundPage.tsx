import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-page__container">
        <div className="not-found-page__icon">🔍</div>
        <h1 className="not-found-page__title">404 - Страница не найдена</h1>
        <p className="not-found-page__message">
          Страница, которую вы ищете, не существует или была перемещена.
        </p>
        <div className="not-found-page__actions">
          <button
            onClick={() => navigate(-1)}
            className="not-found-page__btn not-found-page__btn--back"
          >
            Назад
          </button>
          <button
            onClick={() => navigate('/')}
            className="not-found-page__btn not-found-page__btn--home"
          >
            На главную
          </button>
        </div>
      </div>
    </div>
  );
}
