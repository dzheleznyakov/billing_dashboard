import { useQuery } from '@tanstack/react-query';
import { fetchUsage } from '../../utils/http';
import LoadingIndicator from '../ui/LoadingIndicator';
import ErrorBlock from '../ui/ErrorBlock';
import BillingReportTable from './BillingReportTable';

import './BillingReport.css';
import BillingReportChart from './BillingReportChart';

const BillingReport = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['usage'],
    queryFn: ({ signal }) => fetchUsage({ signal }),
    staleTime: 60_000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
  });

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  } else if (isError) {
    content = (
      <ErrorBlock
        title="Error while fetching usage"
        message={error.message || 'Unexpected error while fettching usage.'}
      />
    );
  } else {
    content = (
      <>
        <BillingReportChart data={data} />
        <BillingReportTable data={data} />
      </>
    );
  }

  return <div className="billing-report">{content}</div>;
};

export default BillingReport;
