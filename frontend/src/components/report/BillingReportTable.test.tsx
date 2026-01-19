import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BillingReportTable from './BillingReportTable';
import type { UsageItem } from '../../model/types';

// Mock the sorting utilities
vi.mock('./utils/sorting', () => ({
  queryParamToSorting: vi.fn(() => []),
  sortingToQueryParam: vi.fn(),
}));

// Mock the date utilities
vi.mock('../../utils/date', () => ({
  formatTimestamp: vi.fn((timestamp: string) => {
    // Format timestamp as dd-MM-yyyy HH:mm
    const date = new Date(timestamp);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }),
}));

describe('<BillingReportTable> component', () => {
  const mockData: UsageItem[] = [
    {
      message_id: 1,
      timestamp: '2024-01-15T10:30:00Z',
      report_name: 'Beta Report',
      credits_used: 150.5,
    },
    {
      message_id: 2,
      timestamp: '2024-01-15T11:30:00Z',
      report_name: 'Alpha Report',
      credits_used: 200.75,
    },
    {
      message_id: 3,
      timestamp: '2024-01-15T12:30:00Z',
      report_name: 'Gamma Report',
      credits_used: 100.25,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render table with data as expected', () => {
    render(<BillingReportTable data={mockData} />);

    // Check table headers
    expect(screen.getByText('Message ID')).toBeInTheDocument();
    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Report Name')).toBeInTheDocument();
    expect(screen.getByText('Credits Used')).toBeInTheDocument();

    // Check table data
    // Check message ids
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    // Check report names
    expect(screen.getByText('Alpha Report')).toBeInTheDocument();
    expect(screen.getByText('Beta Report')).toBeInTheDocument();
    expect(screen.getByText('Gamma Report')).toBeInTheDocument();

    // Check credits used (rounded up to 2 digits after the decimal point)
    expect(screen.getByText('150.50')).toBeInTheDocument();
    expect(screen.getByText('200.75')).toBeInTheDocument();
    expect(screen.getByText('100.25')).toBeInTheDocument();

    // Check timestamps are formatted as dd-MM-yyyy HH:mm
    expect(screen.getByText('15-01-2024 10:30')).toBeInTheDocument();
    expect(screen.getByText('15-01-2024 11:30')).toBeInTheDocument();
    expect(screen.getByText('15-01-2024 12:30')).toBeInTheDocument();
  });

  it('should sort by report name column when clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<BillingReportTable data={mockData} />);

    const reportNameHeader = screen.getByText('Report Name');

    await user.click(reportNameHeader);

    // Check that sorting indicator appears
    const headerText = reportNameHeader.parentElement?.textContent;
    expect(headerText).toContain('🔼');

    // Check that rows are sorted by report name
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0].textContent).toContain('Alpha Report');
    expect(rows[1].textContent).toContain('Beta Report');
    expect(rows[2].textContent).toContain('Gamma Report');
  });

  it('should sort by multiple columns when shift-clicking', async () => {
    const user = userEvent.setup();
    const { container } = render(<BillingReportTable data={mockData} />);

    // First, sort by report name
    const reportNameHeader = screen.getByText('Report Name');
    await user.click(reportNameHeader);

    // Then shift-click to sort by credits used
    const creditsHeader = screen.getByText('Credits Used');
    await user.keyboard('{Shift>}');
    await user.click(creditsHeader);
    await user.keyboard('{/Shift}');

    // Check that both headers have sorting indicators
    const reportNameText = reportNameHeader.parentElement?.textContent;
    const creditsText = creditsHeader.parentElement?.textContent;

    expect(reportNameText).toContain('🔼'); // First sort column
    expect(creditsText).toContain('🔼'); // Second sort column

    // Verify rows are sorted correctly (by report name first, then by credits)
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0].textContent).toContain('Alpha Report');
    expect(rows[0].textContent).toContain('200.75');
  });
});
