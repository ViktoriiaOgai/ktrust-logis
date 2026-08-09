import { useState, useEffect } from 'react';
import { orderService } from '@/services/orderService';
import { customerService } from '@/services/customerService';
import { userService } from '@/services/userService';
import type { Order, OrderFilters, OrderFormData } from '@/services/orderService';
import type { Customer} from '@/services/customerService';
import type { User } from '@/services/userService';
import './OrdersPage.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    customerId: '',
    courierId: '',
    originCity: '',
    destinationCity: '',
    dateFrom: '',
    dateTo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState<OrderFormData>({
    customerId: 0,
    senderName: '',
    senderPhone: '',
    receiverName: '',
    receiverPhone: '',
    originAddress: '',
    destinationAddress: '',
    originCity: '',
    destinationCity: '',
    weightKg: 0,
    cargoType: '',
    declaredValue: 0,
    deliveryPrice: 0,
    estimatedDeliveryDate: '',
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [couriers, setCouriers] = useState<User[]>([]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrders(filters);
      setOrders(response.orders);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getCustomers({ limit: 1000 });
      setCustomers(response.customers);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  };

  const fetchCouriers = async () => {
    try {
      const response = await userService.getUsers({ role: 'Courier', limit: 1000 });
      setCouriers(response.users);
    } catch (err) {
      console.error('Failed to fetch couriers:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchCouriers();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleFilterChange = (key: keyof OrderFilters, value: string) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleCreateClick = () => {
    setEditingOrder(null);
    setFormData({
      customerId: 0,
      senderName: '',
      senderPhone: '',
      receiverName: '',
      receiverPhone: '',
      originAddress: '',
      destinationAddress: '',
      originCity: '',
      destinationCity: '',
      weightKg: 0,
      cargoType: '',
      declaredValue: 0,
      deliveryPrice: 0,
      estimatedDeliveryDate: '',
    });
    setShowModal(true);
  };

  const handleEditClick = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      customerId: order.customer_id,
      senderName: order.sender_name,
      senderPhone: order.sender_phone,
      receiverName: order.receiver_name,
      receiverPhone: order.receiver_phone,
      originAddress: order.origin_address,
      destinationAddress: order.destination_address,
      originCity: order.origin_city,
      destinationCity: order.destination_city,
      weightKg: order.weight_kg,
      cargoType: order.cargo_type,
      declaredValue: order.declared_value,
      deliveryPrice: order.delivery_price,
      estimatedDeliveryDate: order.estimated_delivery_date || '',
    });
    setShowModal(true);
  };

  const handleDeleteClick = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await orderService.deleteOrder(orderId);
      fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete order');
    }
  };

  const handleAssignCourier = async (orderId: number, courierId: number) => {
    try {
      await orderService.assignCourier(orderId, courierId);
      fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign courier');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOrder) {
        await orderService.updateOrder(editingOrder.id, formData);
      } else {
        await orderService.createOrder(formData);
      }
      setShowModal(false);
      fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save order');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name.includes('Kg') || name.includes('Value') || name.includes('Price') 
        ? parseFloat(value) || 0 
        : value 
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Draft': '#6c757d',
      'Registered': '#17a2b8',
      'In Warehouse': '#fd7e14',
      'In Transit': '#007bff',
      'Arrived at Destination': '#6610f2',
      'Out for Delivery': '#20c997',
      'Delivered': '#28a745',
      'Delivery Failed': '#dc3545',
      'Delayed': '#ffc107',
      'Returned': '#6f42c1',
      'Cancelled': '#343a40',
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div className="orders-page">
      <div className="orders-page__header">
        <h1>Order Management</h1>
        <button onClick={handleCreateClick} className="orders-page__create-btn">
          Create Order
        </button>
      </div>

      <div className="orders-page__filters">
        <input
          type="text"
          placeholder="Search by tracking, name, or phone..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="orders-page__search"
        />

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="orders-page__filter"
        >
          <option value="">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Registered">Registered</option>
          <option value="In Warehouse">In Warehouse</option>
          <option value="In Transit">In Transit</option>
          <option value="Arrived at Destination">Arrived at Destination</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Delivery Failed">Delivery Failed</option>
          <option value="Delayed">Delayed</option>
          <option value="Returned">Returned</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <input
          type="text"
          placeholder="Origin city..."
          value={filters.originCity}
          onChange={(e) => handleFilterChange('originCity', e.target.value)}
          className="orders-page__filter"
        />

        <input
          type="text"
          placeholder="Destination city..."
          value={filters.destinationCity}
          onChange={(e) => handleFilterChange('destinationCity', e.target.value)}
          className="orders-page__filter"
        />

        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          className="orders-page__filter"
        />

        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          className="orders-page__filter"
        />
      </div>

      {error && <div className="orders-page__error">{error}</div>}

      {loading ? (
        <div className="orders-page__loading">Loading...</div>
      ) : (
        <>
          <div className="orders-page__table-wrapper">
            <table className="orders-page__table">
              <thead>
                <tr>
                  <th>Tracking</th>
                  <th>Customer</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Courier</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="orders-page__tracking">{order.tracking_number}</td>
                    <td>{order.customer_name}</td>
                    <td>
                      <div>{order.sender_name}</div>
                      <small>{order.sender_phone}</small>
                    </td>
                    <td>
                      <div>{order.receiver_name}</div>
                      <small>{order.receiver_phone}</small>
                    </td>
                    <td>
                      <div>{order.origin_city}</div>
                      <small>→ {order.destination_city}</small>
                    </td>
                    <td>
                      <span
                        className="orders-page__status"
                        style={{ backgroundColor: getStatusColor(order.current_status) }}
                      >
                        {order.current_status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.assigned_courier_id || ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAssignCourier(order.id, parseInt(e.target.value));
                          }
                        }}
                        className="orders-page__courier-select"
                      >
                        <option value="">Unassigned</option>
                        {couriers.map((courier) => (
                          <option key={courier.id} value={courier.id}>
                            {courier.full_name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleEditClick(order)}
                        className="orders-page__action-btn orders-page__action-btn--edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(order.id)}
                        className="orders-page__action-btn orders-page__action-btn--delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && !loading && (
            <div className="orders-page__empty">No orders found</div>
          )}

          {pagination.totalPages > 1 && (
            <div className="orders-page__pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="orders-page__pagination-btn"
              >
                Previous
              </button>
              <span className="orders-page__pagination-info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="orders-page__pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="orders-page__modal-overlay">
          <div className="orders-page__modal">
            <div className="orders-page__modal-header">
              <h2>{editingOrder ? 'Edit Order' : 'Create Order'}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="orders-page__modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="orders-page__form">
              <div className="orders-page__form-row">
                <div className="orders-page__form-group">
                  <label htmlFor="customerId">Customer *</label>
                  <select
                    id="customerId"
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="orders-page__form-group">
                  <label htmlFor="cargoType">Cargo Type *</label>
                  <input
                    type="text"
                    id="cargoType"
                    name="cargoType"
                    value={formData.cargoType}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="orders-page__form-section">
                <h3>Sender Information</h3>
                <div className="orders-page__form-row">
                  <div className="orders-page__form-group">
                    <label htmlFor="senderName">Name *</label>
                    <input
                      type="text"
                      id="senderName"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="orders-page__form-group">
                    <label htmlFor="senderPhone">Phone *</label>
                    <input
                      type="text"
                      id="senderPhone"
                      name="senderPhone"
                      value={formData.senderPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="orders-page__form-section">
                <h3>Receiver Information</h3>
                <div className="orders-page__form-row">
                  <div className="orders-page__form-group">
                    <label htmlFor="receiverName">Name *</label>
                    <input
                      type="text"
                      id="receiverName"
                      name="receiverName"
                      value={formData.receiverName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="orders-page__form-group">
                    <label htmlFor="receiverPhone">Phone *</label>
                    <input
                      type="text"
                      id="receiverPhone"
                      name="receiverPhone"
                      value={formData.receiverPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="orders-page__form-section">
                <h3>Route Information</h3>
                <div className="orders-page__form-row">
                  <div className="orders-page__form-group">
                    <label htmlFor="originAddress">Origin Address *</label>
                    <input
                      type="text"
                      id="originAddress"
                      name="originAddress"
                      value={formData.originAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="orders-page__form-group">
                    <label htmlFor="originCity">Origin City *</label>
                    <input
                      type="text"
                      id="originCity"
                      name="originCity"
                      value={formData.originCity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="orders-page__form-row">
                  <div className="orders-page__form-group">
                    <label htmlFor="destinationAddress">Destination Address *</label>
                    <input
                      type="text"
                      id="destinationAddress"
                      name="destinationAddress"
                      value={formData.destinationAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="orders-page__form-group">
                    <label htmlFor="destinationCity">Destination City *</label>
                    <input
                      type="text"
                      id="destinationCity"
                      name="destinationCity"
                      value={formData.destinationCity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="orders-page__form-section">
                <h3>Package Details</h3>
                <div className="orders-page__form-row">
                  <div className="orders-page__form-group">
                    <label htmlFor="weightKg">Weight (kg) *</label>
                    <input
                      type="number"
                      id="weightKg"
                      name="weightKg"
                      value={formData.weightKg}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0.01"
                      required
                    />
                  </div>

                  <div className="orders-page__form-group">
                    <label htmlFor="declaredValue">Declared Value</label>
                    <input
                      type="number"
                      id="declaredValue"
                      name="declaredValue"
                      value={formData.declaredValue}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div className="orders-page__form-group">
                    <label htmlFor="deliveryPrice">Delivery Price</label>
                    <input
                      type="number"
                      id="deliveryPrice"
                      name="deliveryPrice"
                      value={formData.deliveryPrice}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className="orders-page__form-group">
                  <label htmlFor="estimatedDeliveryDate">Estimated Delivery Date</label>
                  <input
                    type="date"
                    id="estimatedDeliveryDate"
                    name="estimatedDeliveryDate"
                    value={formData.estimatedDeliveryDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="orders-page__form-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="orders-page__form-btn orders-page__form-btn--cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="orders-page__form-btn orders-page__form-btn--submit"
                >
                  {editingOrder ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
