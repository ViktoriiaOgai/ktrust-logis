import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import type { User, UserFilters, CreateUserRequest } from '@/services/userService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import './UsersPage.css';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    search: '',
    role: '',
    isActive: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserRequest>({
    fullName: '',
    email: '',
    password: '',
    role: 'Operator',
    phone: '',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers(filters);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, role: e.target.value, page: 1 });
  };

  const handleActiveFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters({ 
      ...filters, 
      isActive: value === '' ? '' : value === 'true', 
      page: 1 
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleRoleUpdate = async (userId: number, newRole: string) => {
    try {
      await userService.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    }
  };

  const handleToggleActive = async (userId: number, isActive: boolean) => {
    try {
      if (isActive) {
        await userService.deactivateUser(userId);
      } else {
        await userService.activateUser(userId);
      }
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user status');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);

    try {
      await userService.createUser(createForm);
      setShowCreateModal(false);
      setCreateForm({
        fullName: '',
        email: '',
        password: '',
        role: 'Operator',
        phone: '',
      });
      fetchUsers();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setCreateLoading(false);
    }
  };

  const handlePhoneUpdate = async (userId: number, phone: string) => {
    try {
      await userService.updateUserPhone(userId, phone);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update phone');
    }
  };

  return (
    <div className="users-page">
      <div className="users-page__header">
        <h1>Управление пользователями</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="users-page__create-btn"
        >
          + Создать пользователя
        </button>
      </div>

      <div className="users-page__filters">
        <input
          type="text"
          placeholder="Поиск по имени или email..."
          value={filters.search}
          onChange={handleSearchChange}
          className="users-page__search"
        />

        <select
          value={filters.role}
          onChange={handleRoleFilterChange}
          className="users-page__filter"
        >
          <option value="">Все роли</option>
          <option value="Admin">Администратор</option>
          <option value="Operator">Оператор</option>
          <option value="Courier">Курьер</option>
          <option value="User">Пользователь</option>
        </select>

        <select
          value={
  filters.isActive === undefined || filters.isActive === ''
    ? ''
    : String(filters.isActive)
}
          onChange={handleActiveFilterChange}
          className="users-page__filter"
        >
          <option value="">Все статусы</option>
          <option value="true">Активен</option>
          <option value="false">Неактивен</option>
        </select>
      </div>

      {error && <div className="users-page__error">{error}</div>}

      {loading ? (
        <LoadingSpinner message="Loading users..." />
      ) : users.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No users found"
          message="No users match your current filters. Try adjusting your search criteria."
        />
      ) : (
        <>
          <div className="users-page__table-wrapper">
            <table className="users-page__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя</th>
                  <th>Email</th>
                  <th>Телефон</th>
                  <th>Роль</th>
                  <th>Статус</th>
                  <th>Создан</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.role === 'Operator' ? (
                        <input
                          type="text"
                          value={user.phone || ''}
                          onChange={(e) => handlePhoneUpdate(user.id, e.target.value)}
                          className="users-page__phone-input"
                          placeholder="Add phone..."
                          onBlur={(e) => handlePhoneUpdate(user.id, e.target.value)}
                        />
                      ) : (
                        <span>{user.phone || '-'}</span>
                      )}
                    </td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                        className="users-page__role-select"
                      >
                        <option value="Admin">Администратор</option>
                        <option value="Operator">Оператор</option>
                        <option value="Courier">Курьер</option>
                        <option value="User">Пользователь</option>
                      </select>
                    </td>
                    <td>
                      <span
                        className={`users-page__status users-page__status--${
                          user.is_active ? 'active' : 'inactive'
                        }`}
                      >
                        {user.is_active ? 'Активен' : 'Неактивен'}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(user.id, user.is_active)}
                        className={`users-page__action-btn users-page__action-btn--${
                          user.is_active ? 'deactivate' : 'activate'
                        }`}
                      >
                        {user.is_active ? 'Деактивировать' : 'Активировать'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="users-page__pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="users-page__pagination-btn"
              >
                Previous
              </button>
              <span className="users-page__pagination-info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="users-page__pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showCreateModal && (
        <div className="users-page__modal-overlay">
          <div className="users-page__modal">
            <div className="users-page__modal-header">
              <h2>Создать нового пользователя</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="users-page__modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="users-page__modal-form">
              {createError && <div className="users-page__modal-error">{createError}</div>}

              <div className="users-page__form-group">
                <label htmlFor="fullName">Полное имя</label>
                <input
                  type="text"
                  id="fullName"
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="users-page__form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="users-page__form-group">
                <label htmlFor="password">Пароль</label>
                <input
                  type="password"
                  id="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  required
                  minLength={8}
                />
              </div>

              <div className="users-page__form-group">
                <label htmlFor="role">Роль</label>
                <select
                  id="role"
                  value={createForm.role}
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as any })}
                  required
                >
                  <option value="Admin">Администратор</option>
                  <option value="Operator">Оператор</option>
                  <option value="Courier">Курьер</option>
                  <option value="User">Пользователь</option>
                </select>
              </div>

              <div className="users-page__form-group">
                <label htmlFor="phone">Телефон (для операторов)</label>
                <input
                  type="text"
                  id="phone"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                  placeholder="+7 XXX XXX XX XX"
                />
              </div>

              <div className="users-page__modal-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="users-page__modal-btn users-page__modal-btn--cancel"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="users-page__modal-btn users-page__modal-btn--submit"
                >
                  {createLoading ? 'Создание...' : 'Создать пользователя'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
