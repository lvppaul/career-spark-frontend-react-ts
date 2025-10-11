import { useSearchParams } from 'react-router-dom';
import { Result, Button } from 'antd';

export default function PaymentResult() {
  const [params] = useSearchParams();
  const status = params.get('status');
  const message = params.get('message');
  const orderId = params.get('orderId');
  const txnRef = params.get('txnRef');

  const isSuccess = status === 'success';

  return (
    <div className="flex justify-center items-center h-screen">
      {isSuccess ? (
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle={`Đơn hàng #${orderId} (Mã tham chiếu: ${txnRef}) đã được xử lý thành công.`}
          extra={[
            <Button type="primary" key="home" href="/">
              Về trang chủ
            </Button>,
            <Button key="orders" href="/orders">
              Xem lịch sử đơn hàng
            </Button>,
          ]}
        />
      ) : (
        <Result
          status="error"
          title="Thanh toán thất bại!"
          subTitle={`Lỗi: ${decodeURIComponent(message ?? 'Giao dịch không hợp lệ.')}`}
          extra={[
            <Button type="primary" key="retry" href="/">
              Thử lại
            </Button>,
          ]}
        />
      )}
    </div>
  );
}
