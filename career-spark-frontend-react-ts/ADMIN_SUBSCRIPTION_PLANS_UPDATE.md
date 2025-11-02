# Admin Subscription Plans Management - Update

## ✨ Tính năng mới

### API Active Subscription Plans

Đã thêm endpoint mới để lấy danh sách subscription plans đang hoạt động.

**Endpoint**: `GET /api/SubscriptionPlan/active`

**Response**:

```json
{
  "success": true,
  "message": "Successfully retrieved active subscription plans",
  "data": [
    {
      "id": 1,
      "name": "Gói Tháng",
      "price": 39000,
      "benefits": "Gói bình thường",
      "level": 1,
      "durationDays": 30,
      "description": "Thời hạn 30 ngày"
    }
  ],
  "count": 3,
  "timestamp": "2025-11-02T05:09:58.0438054Z"
}
```

## 📁 Files đã thêm/cập nhật

### 1. Service

**File**: `src/features/admin/services/subscriptionPlanService.ts`

- ✅ Thêm method `getActivePlans()` để lấy active plans

### 2. Hook

**File**: `src/features/admin/hooks/useActiveSubscriptionPlans.ts`

- ✅ Hook mới để fetch và quản lý active subscription plans
- ✅ Tự động load data khi component mount
- ✅ Có error handling và loading state

### 3. Component

**File**: `src/features/admin/components/SubscriptionPlanManagement.tsx`

- ✅ Thêm Segmented control để chuyển đổi giữa "Đang hoạt động" và "Tất cả"
- ✅ Tích hợp cả `useSubscriptionPlans` và `useActiveSubscriptionPlans`
- ✅ Tự động refetch cả 2 datasets sau khi create/update/delete

## 🎯 Cách sử dụng

### Sử dụng trong Component

```typescript
import useActiveSubscriptionPlans from '@/features/admin/hooks/useActiveSubscriptionPlans';

function MyComponent() {
  const { data, isLoading, error, refetch } = useActiveSubscriptionPlans();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(plan => (
        <div key={plan.id}>{plan.name} - {plan.price}đ</div>
      ))}
    </div>
  );
}
```

### UI - Chuyển đổi View

Trên UI quản lý subscription plans, bạn có thể:

1. Click "Đang hoạt động" để xem chỉ các plans active
2. Click "Tất cả" để xem tất cả plans (bao gồm inactive)

## 🔄 Workflow

1. **Initial Load**: Mặc định hiển thị "Đang hoạt động"
2. **Switch View**: Click vào Segmented control để chuyển đổi
3. **Create/Update/Delete**: Tự động refetch cả 2 datasets để đảm bảo data consistency

## 📊 API Comparison

| Endpoint                   | Description                           | Use Case                            |
| -------------------------- | ------------------------------------- | ----------------------------------- |
| `/SubscriptionPlan`        | Lấy tất cả plans (including inactive) | Admin view all                      |
| `/SubscriptionPlan/active` | Chỉ lấy active plans                  | Display to users, Admin view active |

## 💡 Best Practices

1. **Hiển thị cho User**: Sử dụng `/active` endpoint
2. **Admin Management**: Có thể toggle giữa "all" và "active"
3. **After Mutations**: Tự động refetch cả 2 datasets để đồng bộ data
