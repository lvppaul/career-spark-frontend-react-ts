import { ConfigProvider } from 'antd';

// Completely suppress Ant Design warnings
const originalWarn = console.warn;
const originalError = console.error;

console.warn = (...args) => {
  const message = args[0]?.toString() || '';
  if (
    message.includes('antd') ||
    message.includes('compatible') ||
    message.includes('React version') ||
    message.includes('Warning: [antd')
  ) {
    return;
  }
  originalWarn(...args);
};

console.error = (...args) => {
  const message = args[0]?.toString() || '';
  if (
    message.includes('antd') ||
    message.includes('compatible') ||
    message.includes('React version') ||
    message.includes('Warning: [antd')
  ) {
    return;
  }
  originalError(...args);
};

// Export a wrapper component that provides Ant Design configuration
export const AntdConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
      // Suppress internal warnings
      warning={{
        strict: false,
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdConfigProvider;
