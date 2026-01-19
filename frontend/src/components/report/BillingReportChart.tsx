import { useMemo } from 'react';
import type { Formatter } from 'recharts/types/component/DefaultTooltipContent';
import type { UsageItem } from '../../model/types';
import { formatDate, formatDayKey } from '../../utils/date';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import './BillingReportChart.css';

type ChartDataPoint = {
  dayKey: string;
  timestamp: string;
  value: number;
};

function getChartData(data: UsageItem[]): ChartDataPoint[] {
  const chartDataMap = data.reduce(
    (acc: Record<string, ChartDataPoint>, { credits_used, timestamp }) => {
      const dayKey = formatDayKey(timestamp);
      if (!acc[dayKey]) {
        acc[dayKey] = {
          dayKey,
          timestamp: formatDate(timestamp),
          value: credits_used,
        };
      } else {
        acc[dayKey].value += credits_used;
      }
      return acc;
    },
    {},
  );

  return Object.values(chartDataMap).sort((a, b) =>
    a.dayKey.localeCompare(b.dayKey),
  );
}

type Props = {
  data: UsageItem[];
};

const BillingReportChart = ({ data }: Props) => {
  const tooltipFormatter: Formatter<number, string> = (value) =>
    value?.toFixed(2);

  const charData = useMemo(() => getChartData(data), [data]);

  return (
    <div className="bar-chart" style={{ width: '100%', height: '30dvh' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={charData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="timestamp" minTickGap={30} />
          <YAxis />
          <Tooltip
            formatter={tooltipFormatter}
            cursor={{ fill: 'transparent' }}
          />
          <Bar
            dataKey="value"
            name="Total Credit Used"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BillingReportChart;
