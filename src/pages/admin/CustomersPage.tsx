import { useState, useEffect } from 'react';
import { customerService } from '@/services/customerService';
import type { Customer, CustomerFilters, CustomerFormData } from '@/services/customerService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import './CustomersPage.css';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<CustomerFilters>({
    page: 1,
    limit: 10,
    search: '',
    city: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    address: '',
    city: '',
    country: '',
    notes: '',
  });

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerService.getCustomers(filters);
      setCustomers(response.customers);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleCityFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, city: e.target.value, page: 1 });
  };

  const handleCountryFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, country: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleCreateClick = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      companyName: '',
      address: '',
      city: '',
      country: '',
      notes: '',
    });
    setShowModal(true);
  };

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone,
      companyName: customer.company_name || '',
      address: customer.address || '',
      city: customer.city || '',
      country: customer.country || '',
      notes: customer.notes || '',
    });
    setShowModal(true);
  };

  const handleDeleteClick = async (customerId: number) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      await customerService.deleteCustomer(customerId);
      fetchCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer.id, formData);
      } else {
        await customerService.createCustomer(formData);
      }
      setShowModal(false);
      fetchCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save customer');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="customers-page">
      <div className="customers-page__header">
        <h1>Customer Management</h1>
        <button onClick={handleCreateClick} className="customers-page__create-btn">
          Create Customer
        </button>
      </div>

      <div className="customers-page__filters">
        <input
          type="text"
          placeholder="Search by name, email, phone, or company..."
          value={filters.search}
          onChange={handleSearchChange}
          className="customers-page__search"
        />

        <input
          type="text"
          placeholder="Filter by city..."
          value={filters.city}
          onChange={handleCityFilterChange}
          className="customers-page__filter"
        />

        <input
          type="text"
          placeholder="Filter by country..."
          value={filters.country}
          onChange={handleCountryFilterChange}
          className="customers-page__filter"
        />
      </div>

      {error && <div className="customers-page__error">{error}</div>}

      {loading ? (
        <LoadingSpinner message="Loading customers..." />
      ) : customers.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No customers found"
          message="No customers match your current filters. Try adjusting your search criteria."
          action={{
            label: 'Create Customer',
            onClick: () => setShowModal(true),
          }}
        />
      ) : (
        <>
          <div className="customers-page__table-wrapper">
            <table className="customers-page__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>City</th>
                  <th>Country</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.name}</td>
                    <td>{customer.email || '-'}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.company_name || '-'}</td>
                    <td>{customer.city || '-'}</td>
                    <td>{customer.country || '-'}</td>
                    <td>
                      <button
                        onClick={() => handleEditClick(customer)}
                        className="customers-page__action-btn customers-page__action-btn--edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(customer.id)}
                        className="customers-page__action-btn customers-page__action-btn--delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="customers-page__pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="customers-page__pagination-btn"
              >
                Previous
              </button>
              <span className="customers-page__pagination-info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="customers-page__pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="customers-page__modal-overlay">
          <div className="customers-page__modal">
            <div className="customers-page__modal-header">
              <h2>{editingCustomer ? 'Edit Customer' : 'Create Customer'}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="customers-page__modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="customers-page__form">
              <div className="customers-page__form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="customers-page__form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="customers-page__form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="customers-page__form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="customers-page__form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="customers-page__form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className="customers-page__form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>

              <div className="customers-page__form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="customers-page__form-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="customers-page__form-btn customers-page__form-btn--cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="customers-page__form-btn customers-page__form-btn--submit"
                >
                  {editingCustomer ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
