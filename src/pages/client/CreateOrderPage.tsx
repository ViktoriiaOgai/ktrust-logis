import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { customerService } from '@/services/customerService';
import { useToast } from '@/components/ui/Toast';
import './CreateOrderPage.css';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    customerId: '',
    senderName: '',
    senderPhone: '',
    receiverName: '',
    receiverPhone: '',
    originAddress: '',
    destinationAddress: '',
    originCity: '',
    destinationCity: '',
    weightKg: '',
    cargoType: '',
    declaredValue: '',
    deliveryPrice: '',
    estimatedDeliveryDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await customerService.getCustomers(1, 100);
      setCustomers(data.items);
    } catch (error) {
      showToast('Failed to fetch customers', 'error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerId) newErrors.customerId = 'Customer is required';
    if (!formData.senderName.trim()) newErrors.senderName = 'Sender name is required';
    if (!formData.senderPhone.trim()) newErrors.senderPhone = 'Sender phone is required';
    if (!formData.receiverName.trim()) newErrors.receiverName = 'Receiver name is required';
    if (!formData.receiverPhone.trim()) newErrors.receiverPhone = 'Receiver phone is required';
    if (!formData.originAddress.trim()) newErrors.originAddress = 'Origin address is required';
    if (!formData.destinationAddress.trim()) newErrors.destinationAddress = 'Destination address is required';
    if (!formData.originCity.trim()) newErrors.originCity = 'Origin city is required';
    if (!formData.destinationCity.trim()) newErrors.destinationCity = 'Destination city is required';
    if (!formData.weightKg || parseFloat(formData.weightKg) <= 0) newErrors.weightKg = 'Valid weight is required';
    if (!formData.cargoType.trim()) newErrors.cargoType = 'Cargo type is required';
    if (!formData.declaredValue || parseFloat(formData.declaredValue) < 0) newErrors.declaredValue = 'Valid declared value is required';
    if (!formData.deliveryPrice || parseFloat(formData.deliveryPrice) < 0) newErrors.deliveryPrice = 'Valid delivery price is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors before submitting', 'error');
      return;
    }

    setLoading(true);
    try {
      await orderService.createOrder({
        customerId: parseInt(formData.customerId),
        senderName: formData.senderName,
        senderPhone: formData.senderPhone,
        receiverName: formData.receiverName,
        receiverPhone: formData.receiverPhone,
        originAddress: formData.originAddress,
        destinationAddress: formData.destinationAddress,
        originCity: formData.originCity,
        destinationCity: formData.destinationCity,
        weightKg: parseFloat(formData.weightKg),
        cargoType: formData.cargoType,
        declaredValue: parseFloat(formData.declaredValue),
        deliveryPrice: parseFloat(formData.deliveryPrice),
        estimatedDeliveryDate: formData.estimatedDeliveryDate || null,
      });

      showToast('Order created successfully', 'success');
      navigate('/orders');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to create order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      customerId: '',
      senderName: '',
      senderPhone: '',
      receiverName: '',
      receiverPhone: '',
      originAddress: '',
      destinationAddress: '',
      originCity: '',
      destinationCity: '',
      weightKg: '',
      cargoType: '',
      declaredValue: '',
      deliveryPrice: '',
      estimatedDeliveryDate: '',
    });
    setErrors({});
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="create-order-page">
      <div className="create-order-page__header">
        <h1>Create New Order</h1>
        <button onClick={() => navigate('/orders')} className="create-order-page__back-btn">
          ← Back to Orders
        </button>
      </div>

      <form onSubmit={handleSubmit} className="create-order-page__form">
        {/* Customer Selection */}
        <div className="create-order-page__section">
          <h2>Customer Information</h2>
          <div className="create-order-page__form-group">
            <label htmlFor="customerId">Customer *</label>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="create-order-page__search-input"
            />
            <select
              id="customerId"
              name="customerId"
              value={formData.customerId}
              onChange={handleInputChange}
              className={errors.customerId ? 'create-order-page__input--error' : ''}
            >
              <option value="">Select a customer</option>
              {filteredCustomers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.email} - {customer.phone}
                </option>
              ))}
            </select>
            {errors.customerId && <span className="create-order-page__error">{errors.customerId}</span>}
          </div>
        </div>

        {/* Sender Information */}
        <div className="create-order-page__section">
          <h2>Sender Information</h2>
          <div className="create-order-page__form-row">
            <div className="create-order-page__form-group">
              <label htmlFor="senderName">Sender Name *</label>
              <input
                type="text"
                id="senderName"
                name="senderName"
                value={formData.senderName}
                onChange={handleInputChange}
                className={errors.senderName ? 'create-order-page__input--error' : ''}
              />
              {errors.senderName && <span className="create-order-page__error">{errors.senderName}</span>}
            </div>
            <div className="create-order-page__form-group">
              <label htmlFor="senderPhone">Sender Phone *</label>
              <input
                type="tel"
                id="senderPhone"
                name="senderPhone"
                value={formData.senderPhone}
                onChange={handleInputChange}
                className={errors.senderPhone ? 'create-order-page__input--error' : ''}
              />
              {errors.senderPhone && <span className="create-order-page__error">{errors.senderPhone}</span>}
            </div>
          </div>
        </div>

        {/* Receiver Information */}
        <div className="create-order-page__section">
          <h2>Receiver Information</h2>
          <div className="create-order-page__form-row">
            <div className="create-order-page__form-group">
              <label htmlFor="receiverName">Receiver Name *</label>
              <input
                type="text"
                id="receiverName"
                name="receiverName"
                value={formData.receiverName}
                onChange={handleInputChange}
                className={errors.receiverName ? 'create-order-page__input--error' : ''}
              />
              {errors.receiverName && <span className="create-order-page__error">{errors.receiverName}</span>}
            </div>
            <div className="create-order-page__form-group">
              <label htmlFor="receiverPhone">Receiver Phone *</label>
              <input
                type="tel"
                id="receiverPhone"
                name="receiverPhone"
                value={formData.receiverPhone}
                onChange={handleInputChange}
                className={errors.receiverPhone ? 'create-order-page__input--error' : ''}
              />
              {errors.receiverPhone && <span className="create-order-page__error">{errors.receiverPhone}</span>}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="create-order-page__section">
          <h2>Address Information</h2>
          <div className="create-order-page__form-row">
            <div className="create-order-page__form-group">
              <label htmlFor="originCity">Origin City *</label>
              <input
                type="text"
                id="originCity"
                name="originCity"
                value={formData.originCity}
                onChange={handleInputChange}
                className={errors.originCity ? 'create-order-page__input--error' : ''}
              />
              {errors.originCity && <span className="create-order-page__error">{errors.originCity}</span>}
            </div>
            <div className="create-order-page__form-group">
              <label htmlFor="destinationCity">Destination City *</label>
              <input
                type="text"
                id="destinationCity"
                name="destinationCity"
                value={formData.destinationCity}
                onChange={handleInputChange}
                className={errors.destinationCity ? 'create-order-page__input--error' : ''}
              />
              {errors.destinationCity && <span className="create-order-page__error">{errors.destinationCity}</span>}
            </div>
          </div>
          <div className="create-order-page__form-group">
            <label htmlFor="originAddress">Origin Address *</label>
            <textarea
              id="originAddress"
              name="originAddress"
              value={formData.originAddress}
              onChange={handleInputChange}
              rows={2}
              className={errors.originAddress ? 'create-order-page__input--error' : ''}
            />
            {errors.originAddress && <span className="create-order-page__error">{errors.originAddress}</span>}
          </div>
          <div className="create-order-page__form-group">
            <label htmlFor="destinationAddress">Destination Address *</label>
            <textarea
              id="destinationAddress"
              name="destinationAddress"
              value={formData.destinationAddress}
              onChange={handleInputChange}
              rows={2}
              className={errors.destinationAddress ? 'create-order-page__input--error' : ''}
            />
            {errors.destinationAddress && <span className="create-order-page__error">{errors.destinationAddress}</span>}
          </div>
        </div>

        {/* Package Information */}
        <div className="create-order-page__section">
          <h2>Package Information</h2>
          <div className="create-order-page__form-row">
            <div className="create-order-page__form-group">
              <label htmlFor="weightKg">Weight (kg) *</label>
              <input
                type="number"
                id="weightKg"
                name="weightKg"
                value={formData.weightKg}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className={errors.weightKg ? 'create-order-page__input--error' : ''}
              />
              {errors.weightKg && <span className="create-order-page__error">{errors.weightKg}</span>}
            </div>
            <div className="create-order-page__form-group">
              <label htmlFor="cargoType">Cargo Type *</label>
              <select
                id="cargoType"
                name="cargoType"
                value={formData.cargoType}
                onChange={handleInputChange}
                className={errors.cargoType ? 'create-order-page__input--error' : ''}
              >
                <option value="">Select cargo type</option>
                <option value="Documents">Documents</option>
                <option value="Small Package">Small Package</option>
                <option value="Medium Package">Medium Package</option>
                <option value="Large Package">Large Package</option>
                <option value="Fragile">Fragile</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Food">Food</option>
                <option value="Other">Other</option>
              </select>
              {errors.cargoType && <span className="create-order-page__error">{errors.cargoType}</span>}
            </div>
          </div>
          <div className="create-order-page__form-row">
            <div className="create-order-page__form-group">
              <label htmlFor="declaredValue">Declared Value ($) *</label>
              <input
                type="number"
                id="declaredValue"
                name="declaredValue"
                value={formData.declaredValue}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className={errors.declaredValue ? 'create-order-page__input--error' : ''}
              />
              {errors.declaredValue && <span className="create-order-page__error">{errors.declaredValue}</span>}
            </div>
            <div className="create-order-page__form-group">
              <label htmlFor="deliveryPrice">Delivery Price ($) *</label>
              <input
                type="number"
                id="deliveryPrice"
                name="deliveryPrice"
                value={formData.deliveryPrice}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className={errors.deliveryPrice ? 'create-order-page__input--error' : ''}
              />
              {errors.deliveryPrice && <span className="create-order-page__error">{errors.deliveryPrice}</span>}
            </div>
          </div>
          <div className="create-order-page__form-group">
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

        {/* Actions */}
        <div className="create-order-page__actions">
          <button
            type="button"
            onClick={handleReset}
            className="create-order-page__btn create-order-page__btn--reset"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={loading}
            className="create-order-page__btn create-order-page__btn--submit"
          >
            {loading ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
