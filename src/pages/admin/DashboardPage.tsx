import { useState, useEffect } from 'react';
import { dashboardService } from '@/services/dashboardService';
import type { DashboardStats, OrderTrend, TopCourier } from '@/services/dashboardService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import './DashboardPage.css';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<OrderTrend[]>([]);
  const [topCouriers, setTopCouriers] = useState<TopCourier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, trendsData, couriersData] = await Promise.all([
        dashboardService.getDashboardStats(dateFrom || undefined, dateTo || undefined),
        dashboardService.getOrderTrends(30),
        dashboardService.getTopCouriers(5),
      ]);

      setStats(statsData);
      setTrends(trendsData);
      setTopCouriers(couriersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить данные дашборда');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateFrom, dateTo]);

  const handleDateFilter = () => {
    fetchDashboardData();
  };

  const handleResetFilters = () => {
    setDateFrom('');
    setDateTo('');
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <LoadingSpinner message="Загрузка данных дашборда..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <EmptyState
          icon="⚠️"
          title="Ошибка загрузки дашборда"
          message={error}
          action={{
            label: 'Повторить',
            onClick: fetchDashboardData,
          }}
        />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-page">
        <EmptyState
          icon="📊"
          title="Нет данных"
          message="В данный момент нет данных для отображения."
        />
      </div>
    );
  }

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

  const successRate = stats.deliveryStats.totalDeliveries > 0
    ? Math.round((stats.deliveryStats.successfulDeliveries / stats.deliveryStats.totalDeliveries) * 100)
    : 0;

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <h1>Дашборд</h1>
        <div className="dashboard-page__filters">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="dashboard-page__date-input"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="dashboard-page__date-input"
          />
          <button onClick={handleDateFilter} className="dashboard-page__filter-btn">
            Применить
          </button>
          <button onClick={handleResetFilters} className="dashboard-page__filter-btn dashboard-page__filter-btn--reset">
            Сбросить
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="dashboard-page__stats-grid">
        <div className="dashboard-page__stat-card">
          <div className="dashboard-page__stat-card__title">Всего заказов</div>
          <div className="dashboard-page__stat-card__value">{stats.overview.totalOrders}</div>
          <div className="dashboard-page__stat-card__icon">📦</div>
        </div>
        <div className="dashboard-page__stat-card">
          <div className="dashboard-page__stat-card__title">Всего клиентов</div>
          <div className="dashboard-page__stat-card__value">{stats.overview.totalCustomers}</div>
          <div className="dashboard-page__stat-card__icon">👥</div>
        </div>
        <div className="dashboard-page__stat-card">
          <div className="dashboard-page__stat-card__title">Всего пользователей</div>
          <div className="dashboard-page__stat-card__value">{stats.overview.totalUsers}</div>
          <div className="dashboard-page__stat-card__icon">👤</div>
        </div>
        <div className="dashboard-page__stat-card">
          <div className="dashboard-page__stat-card__title">Общая выручка</div>
          <div className="dashboard-page__stat-card__value">${stats.overview.totalRevenue.toFixed(2)}</div>
          <div className="dashboard-page__stat-card__icon">💰</div>
        </div>
      </div>

      <div className="dashboard-page__charts-grid">
        {/* Orders by Status */}
        <div className="dashboard-page__chart-card">
          <h2>Заказы по статусам</h2>
          <div className="dashboard-page__status-bars">
            {stats.ordersByStatus.map((item: { current_status: string; count: number }) => (
              <div key={item.current_status} className="dashboard-page__status-bar">
                <div className="dashboard-page__status-bar__label">
                  {getStatusLabel(item.current_status)}
                </div>
                <div className="dashboard-page__status-bar__track">
                  <div
                    className="dashboard-page__status-bar__fill"
                    style={{
                      width: `${(item.count / stats.overview.totalOrders) * 100}%`,
                      backgroundColor: getStatusColor(item.current_status),
                    }}
                  />
                </div>
                <div className="dashboard-page__status-bar__count">{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Statistics */}
        <div className="dashboard-page__chart-card">
          <h2>Статистика доставок</h2>
          <div className="dashboard-page__delivery-stats">
            <div className="dashboard-page__delivery-stat">
              <div className="dashboard-page__delivery-stat__label">Всего доставок</div>
              <div className="dashboard-page__delivery-stat__value">{stats.deliveryStats.totalDeliveries}</div>
            </div>
            <div className="dashboard-page__delivery-stat dashboard-page__delivery-stat--success">
              <div className="dashboard-page__delivery-stat__label">Успешных</div>
              <div className="dashboard-page__delivery-stat__value">{stats.deliveryStats.successfulDeliveries}</div>
            </div>
            <div className="dashboard-page__delivery-stat dashboard-page__delivery-stat--failed">
              <div className="dashboard-page__delivery-stat__label">Неудачных</div>
              <div className="dashboard-page__delivery-stat__value">{stats.deliveryStats.failedDeliveries}</div>
            </div>
            <div className="dashboard-page__delivery-stat dashboard-page__delivery-stat--delayed">
              <div className="dashboard-page__delivery-stat__label">Задержанных</div>
              <div className="dashboard-page__delivery-stat__value">{stats.deliveryStats.delayedDeliveries}</div>
            </div>
          </div>
          <div className="dashboard-page__success-rate">
            <div className="dashboard-page__success-rate__label">Успешность</div>
            <div className="dashboard-page__success-rate__value">{successRate}%</div>
          </div>
        </div>
      </div>

      {/* Order Trends */}
      <div className="dashboard-page__chart-card dashboard-page__chart-card--full">
        <h2>Тренды заказов (последние 30 дней)</h2>
        <div className="dashboard-page__trends-chart">
          {trends.map((trend) => (
            <div key={trend.date} className="dashboard-page__trend-bar">
              <div className="dashboard-page__trend-bar__date">{new Date(trend.date).toLocaleDateString()}</div>
              <div className="dashboard-page__trend-bar__track">
                <div
                  className="dashboard-page__trend-bar__fill"
                  style={{
                    width: `${(trend.orders_count / Math.max(...trends.map(t => t.orders_count))) * 100}%`,
                  }}
                />
              </div>
              <div className="dashboard-page__trend-bar__count">{trend.orders_count}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-page__charts-grid">
        {/* Top Couriers */}
        <div className="dashboard-page__chart-card">
          <h2>Лучшие курьеры</h2>
          <div className="dashboard-page__couriers-list">
            {topCouriers.map((courier, index) => (
              <div key={courier.id} className="dashboard-page__courier-item">
                <div className="dashboard-page__courier-item__rank">#{index + 1}</div>
                <div className="dashboard-page__courier-item__info">
                  <div className="dashboard-page__courier-item__name">{courier.full_name}</div>
                  <div className="dashboard-page__courier-item__stats">
                    <span>{courier.successful_deliveries} успешных</span>
                    <span>•</span>
                    <span>{courier.total_deliveries} всего</span>
                  </div>
                </div>
              </div>
            ))}
            {topCouriers.length === 0 && (
              <div className="dashboard-page__empty">Нет данных о курьерах</div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="dashboard-page__chart-card">
          <h2>Последние заказы</h2>
          <div className="dashboard-page__recent-orders">
            {stats.recentOrders.map((order: { id: number; tracking_number: string; customer_name: string; origin_city: string; destination_city: string; current_status: string }) => (
              <div key={order.id} className="dashboard-page__recent-order">
                <div className="dashboard-page__recent-order__tracking">{order.tracking_number}</div>
                <div className="dashboard-page__recent-order__info">
                  <div className="dashboard-page__recent-order__customer">{order.customer_name}</div>
                  <div className="dashboard-page__recent-order__route">
                    {order.origin_city} → {order.destination_city}
                  </div>
                </div>
                <div className="dashboard-page__recent-order__status">
                  <span
                    className="dashboard-page__recent-order__status-badge"
                    style={{ backgroundColor: getStatusColor(order.current_status) }}
                  >
                    {getStatusLabel(order.current_status)}
                  </span>
                </div>
              </div>
            ))}
            {stats.recentOrders.length === 0 && (
              <div className="dashboard-page__empty">Нет последних заказов</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
