import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { statusService } from '../../services/statusService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import StatusBadge from '@/components/ui/StatusBadge';
import './OrderDetailsPage.css';

interface Order {
  id: number;
  tracking_number: string;
  current_status: string;
  sender_name: string;
  sender_phone: string;
  receiver_name: string;
  receiver_phone: string;
  origin_address: string;
  destination_address: string;
  origin_city: string;
  destination_city: string;
  weight_kg: number;
  cargo_type: string;
  declared_value: number;
  delivery_price: number;
  estimated_delivery_date: string;
  created_at: string;
  customer: {
    id: number;
    name: string;
    phone: string;
    email: string;
  };
  courier?: {
    id: number;
    full_name: string;
  };
}

interface StatusHistory {
  id: number;
  old_status: string;
  new_status: string;
  comment: string;
  changed_by_user: string;
  created_at: string;
}

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');
  const [updating, setUpdating] = useState(false);

  const availableStatuses = ['Draft', 'Registered', 'In Warehouse', 'In Transit', 'Arrived at Destination', 'Out for Delivery', 'Delivered', 'Delivery Failed', 'Delayed', 'Returned', 'Cancelled'];

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const orderData = await orderService.getOrderById(parseInt(id));
      setOrder(orderData);
      
      const historyData = await statusService.getStatusHistory(parseInt(id));
      setStatusHistory(historyData);
    } catch (error) {
      showToast('Failed to fetch order details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!id || !newStatus) return;

    // Validate comment for exception statuses
    const exceptionStatuses = ['Delayed', 'Delivery Failed', 'Returned', 'Cancelled'];
    if (exceptionStatuses.includes(newStatus) && !comment.trim()) {
      showToast('Comment is required for this status change', 'error');
      return;
    }

    setUpdating(true);
    try {
      await statusService.updateStatus(parseInt(id), newStatus, comment);
      showToast('Status updated successfully', 'success');
      setShowStatusModal(false);
      setNewStatus('');
      setComment('');
      fetchOrderDetails();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const canUpdateStatus = () => {
    if (!user) return false;
    
    if (user.role === 'Admin') return true;
    if (user.role === 'Operator') {
      // Operators can update up to In Transit / Delayed
      const allowedForOperator = ['Draft', 'Registered', 'In Warehouse', 'In Transit', 'Delayed'];
      return allowedForOperator.includes(order?.current_status || '');
    }
    if (user.role === 'Courier') {
      // Couriers can only update to Out for Delivery, Delivered, Delivery Failed
      const allowedForCourier = ['Out for Delivery', 'Delivered', 'Delivery Failed'];
      return allowedForCourier.includes(newStatus);
    }
    return false;
  };

  if (loading) {
    return <div className="order-details-page">Loading...</div>;
  }

  if (!order) {
    return <div className="order-details-page">Order not found</div>;
  }

  return (
    <div className="order-details-page">
      <div className="order-details-page__header">
        <button onClick={() => navigate('/orders')} className="order-details-page__back-btn">
          ← Back to Orders
        </button>
        <h1>Order Details</h1>
        {canUpdateStatus() && (
          <button
            onClick={() => setShowStatusModal(true)}
            className="order-details-page__update-btn"
          >
            Update Status
          </button>
        )}
      </div>

      <div className="order-details-page__content">
        {/* Order Information */}
        <div className="order-details-page__section">
          <h2>Order Information</h2>
          <div className="order-details-page__info-grid">
            <div className="order-details-page__info-item">
              <label>Tracking Number</label>
              <span>{order.tracking_number}</span>
            </div>
            <div className="order-details-page__info-item">
              <label>Status</label>
              <StatusBadge status={order.current_status} />
            </div>
            <div className="order-details-page__info-item">
              <label>Created At</label>
              <span>{new Date(order.created_at).toLocaleString()}</span>
            </div>
            <div className="order-details-page__info-item">
              <label>Estimated Delivery</label>
              <span>{order.estimated_delivery_date ? new Date(order.estimated_delivery_date).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Sender Information */}
        <div className="order-details-page__section">
          <h2>Sender Information</h2>
          <div className="order-details-page__info-grid">
            <div className="order-details-page__info-item">
              <label>Name</label>
              <span>{order.sender_name}</span>
            </div>
            <div className="order-details-page__info-item">
              <label>Phone</label>
              <span>{order.sender_phone}</span>
            </div>
            <div className="order-details-page__info-item order-details-page__info-item--full">
              <label>Address</label>
              <span>{order.origin_address}</span>
            </div>
            <div className="order-details-page__info-item">
              <label>City</label>
              <span>{order.origin_city}</span>
            </div>
          </div>
        </div>

        {/* Receiver Information */}
        <div className="order-details-page__section">
          <h2>Receiver Information</h2>
          <div className="order-details-page__info-grid">
            <div className="order-details-page__info-item">
              <label>Name</label>
              <span>{order.receiver_name}</span>
            </div>
            <div className="order-details-page__info-item">
              <label>Phone</label>
              <span>{order.receiver_phone}</span>
            </div>
            <div className="order-details-page__info-item order-details-page__info-item--full">
              <label>Address</label>
              <span>{order.destination_address}</span>
            </div>
            <div className="order-details-page__info-item">
              <label>City</label>
              <span>{order.destination_city}</span>
            </div>
          </div>
        </div>

        {/* Package Information */}
        <div className="order-details-page__section">
          <h2>Package Information</h2>
          <div className="order-details-page__info-grid">
            <div className="order-details-page__info-item">
              <label>Weight</label>
              <span>{order.weight_kg} kg</span>
            </div>
            <div className="order-details-page__info-item">
              <label>Cargo Type</label>
              <span>{order.cargo_type}</span>
            </div>
            <div className="order-details-page__info-item">
              <label>Declared Value</label>
              <span>${order.declared_value.toFixed(2)}</span>
            </div>
            <div className="order-details-page__info-item">
              <label>Delivery Price</label>
              <span>${order.delivery_price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="order-details-page__section">
          <h2>Customer Information</h2>
          <div className="order-details-page__info-grid">
            <div className="order-details-page__info-item">
              <label>Name</label>
              <span>{order.customer.name}</span>
            </div>
            <div className="order-details-page__info-item">
              <label>Phone</label>
              <span>{order.customer.phone}</span>
            </div>
            <div className="order-details-page__info-item">
              <label>Email</label>
              <span>{order.customer.email}</span>
            </div>
          </div>
        </div>

        {/* Courier Information */}
        {order.courier && (
          <div className="order-details-page__section">
            <h2>Assigned Courier</h2>
            <div className="order-details-page__info-grid">
              <div className="order-details-page__info-item">
                <label>Name</label>
                <span>{order.courier.full_name}</span>
              </div>
            </div>
          </div>
        )}

        {/* Status History */}
        <div className="order-details-page__section">
          <h2>Status History</h2>
          <div className="order-details-page__history">
            {statusHistory.length === 0 ? (
              <p className="order-details-page__empty">No status history available</p>
            ) : (
              statusHistory.map((history) => (
                <div key={history.id} className="order-details-page__history-item">
                  <div className="order-details-page__history-item__status">
                    <StatusBadge status={history.old_status} />
                    <span className="order-details-page__history-item__arrow">→</span>
                    <StatusBadge status={history.new_status} />
                  </div>
                  <div className="order-details-page__history-item__details">
                    <span className="order-details-page__history-item__user">
                      Changed by: {history.changed_by_user}
                    </span>
                    <span className="order-details-page__history-item__date">
                      {new Date(history.created_at).toLocaleString()}
                    </span>
                  </div>
                  {history.comment && (
                    <div className="order-details-page__history-item__comment">
                      Comment: {history.comment}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="order-details-page__modal-overlay">
          <div className="order-details-page__modal">
            <h2>Update Status</h2>
            <div className="order-details-page__modal__form-group">
              <label>New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="">Select status</option>
                {availableStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="order-details-page__modal__form-group">
              <label>Comment {['Delayed', 'Delivery Failed', 'Returned', 'Cancelled'].includes(newStatus) && '(Required)'}</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Add a comment for this status change..."
              />
            </div>
            <div className="order-details-page__modal__actions">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setNewStatus('');
                  setComment('');
                }}
                className="order-details-page__modal__btn order-details-page__modal__btn--cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={!newStatus || updating}
                className="order-details-page__modal__btn order-details-page__modal__btn--confirm"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
