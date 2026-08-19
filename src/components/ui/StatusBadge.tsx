import './StatusBadge.css';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'Draft': 'Черновик',
      'Registered': 'Зарегистрирован',
      'In Warehouse': 'На складе',
      'In Transit': 'В пути',
      'Arrived at Destination': 'Прибыл',
      'Out for Delivery': 'Доставляется',
      'Delivered': 'Доставлен',
      'Delivery Failed': 'Не доставлен',
      'Delayed': 'Задержан',
      'Returned': 'Возвращен',
      'Cancelled': 'Отменен',
    };
    return labels[status] || status;
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
    <span
      className="status-badge"
      style={{ backgroundColor: getStatusColor(status) }}
    >
      {getStatusLabel(status)}
    </span>
  );
}
