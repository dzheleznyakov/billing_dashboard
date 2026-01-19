import BillingReport from './components/report/BillingReport';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <h1 className="page-header">Credit Usage: Dashboard</h1>

      <QueryClientProvider client={queryClient}>
        <BillingReport />
      </QueryClientProvider>
    </>
  );
}

export default App;
