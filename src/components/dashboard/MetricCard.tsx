import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import type { MetricCardData } from '../../types/kpi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export function MetricCard({ data }: { data: MetricCardData }) {
  const isDark = data.style === 'dark';
  const bgClass = isDark ? 'bg-brand-charcoal text-white' : 'bg-white text-gray-800';
  const labelColor = isDark ? 'text-gray-300' : 'text-gray-500';
  const isNegative = data.delta?.includes('-');
  const badgeColor = isDark ? 'bg-brand-orangedark/20 text-brand-orangelight' : isNegative ? 'bg-brand-red/10 text-red-600' : 'bg-brand-orangedark/10 text-brand-orangedark';

  const chartData = {
    labels: data.trend.map((_, i) => i.toString()),
    datasets: [{ data: data.trend, borderColor: isDark ? '#A7F3D0' : '#378ADD', borderWidth: 2, tension: 0.4, pointRadius: 0 }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false, min: Math.min(...data.trend) * 0.8 } },
    layout: { padding: 0 },
  };

  return (
    <div className={`${bgClass} rounded-3xl p-6 border ${isDark ? 'border-brand-charcoal shadow-lg shadow-brand-charcoal/20' : 'border-gray-100 shadow-card'} relative overflow-hidden flex flex-col justify-between`}>
      <div className="flex justify-between items-start mb-4 relative z-10 w-full">
        <span className={`text-sm font-semibold ${labelColor} z-10`}>{data.label}</span>
        {data.delta && <span className={`px-2.5 py-1 rounded-full text-xs font-bold z-10 ${badgeColor}`}>{data.delta}</span>}
      </div>
      <div className="flex items-end justify-between relative z-10 w-full">
        <span className="text-3xl font-extrabold tracking-tight">{typeof data.value === 'number' ? data.value.toLocaleString() : data.value}</span>
        {data.trend.length > 0 && <div className="w-16 h-8 opacity-90"><Line data={chartData} options={chartOptions as any} /></div>}
      </div>
      {isDark && <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-dark rounded-full opacity-30 blur-2xl z-0"></div>}
    </div>
  );
}
