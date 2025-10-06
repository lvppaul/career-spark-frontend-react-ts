import { AppRouter } from './router';
import AntdConfigProvider from './components/AntdConfigProvider';

function App() {
  return (
    <AntdConfigProvider>
      <AppRouter />
    </AntdConfigProvider>
  );
}

export default App;
