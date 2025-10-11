import { useEffect, useState, type JSX } from 'react';
import { Spin } from 'antd';
import { subscribeLoading } from '@/lib/loadingService';

export default function LoadingOverlay(): JSX.Element | null {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeLoading((count) => setActive(count));
    return unsubscribe;
  }, []);

  if (!active) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)',
        zIndex: 9999,
        pointerEvents: 'auto',
      }}
      aria-hidden="true"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <Spin size="large" />
        <div style={{ color: '#fff', fontSize: 14 }}>Đang xử lý...</div>
      </div>
    </div>
  );
}
