import { render, screen } from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BillingReport from './BillingReport';

// Mock the useQuery hook
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

describe('<BillingReport> component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>,
    );
  };

  it('should show loading indicator when query is pending', async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useQuery>);

    renderWithQueryClient(<BillingReport />);

    const loadingIndicator = document.querySelector('.lds-ring');
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('should show error block when there is an error', async () => {
    const errorMessage = 'Failed to fetch usage data';
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      error: new Error(errorMessage),
    } as ReturnType<typeof useQuery>);

    renderWithQueryClient(<BillingReport />);

    expect(
      await screen.findByText(/Error while fetching usage/),
    ).toBeInTheDocument();
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it('should show table and chart when data comes through', async () => {
    const mockData = [
      {
        message_id: 1,
        timestamp: '2024-01-15T10:30:00Z',
        report_name: 'Report 1',
        credits_used: 100,
      },
      {
        message_id: 2,
        timestamp: '2024-01-15T11:30:00Z',
        report_name: 'Report 2',
        credits_used: 200,
      },
    ];
    vi.mocked(useQuery).mockReturnValue({
      data: mockData,
      isPending: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useQuery>);

    renderWithQueryClient(<BillingReport />);

    // Both components should render without errors
    // Wait for the table to appear (loading completes and data renders)
    expect(await screen.findByRole('table')).toBeInTheDocument();
  });
});
