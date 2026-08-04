import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import type { User, UserFilters } from '@/services/userService';
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

  return (
    <div className="users-page">
      <div className="users-page__header">
        <h1>User Management</h1>
      </div>

      <div className="users-page__filters">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={handleSearchChange}
          className="users-page__search"
        />

        <select
          value={filters.role}
          onChange={handleRoleFilterChange}
          className="users-page__filter"
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Operator">Operator</option>
          <option value="Courier">Courier</option>
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
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {error && <div className="users-page__error">{error}</div>}

      {loading ? (
        <div className="users-page__loading">Loading...</div>
      ) : (
        <>
          <div className="users-page__table-wrapper">
            <table className="users-page__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                        className="users-page__role-select"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Operator">Operator</option>
                        <option value="Courier">Courier</option>
                      </select>
                    </td>
                    <td>
                      <span
                        className={`users-page__status users-page__status--${
                          user.is_active ? 'active' : 'inactive'
                        }`}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
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
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && !loading && (
            <div className="users-page__empty">No users found</div>
          )}

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
    </div>
  );
}
