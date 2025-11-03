import OrderManagement from '@/features/admin/components/OrderManagement';

/**
 * Admin page for managing orders
 */
export function OrdersPage() {
  return (
    <div style={{ padding: '24px' }}>
      <OrderManagement />
    </div>
  );
}

export default OrdersPage;
