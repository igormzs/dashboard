import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

export function EngagementGauge({ averageEngagement }: { averageEngagement: number }) {
  const chartData = {
    datasets: [{
      data: [averageEngagement, Math.max(0, 10 - averageEngagement)],
      backgroundColor: ['#F59652', '#f3f4f6'],
      borderWidth: 0, circumference: 180, rotation: -90, cutout: '80%',
      borderRadius: { outerStart: 50, outerEnd: 50, innerStart: 50, innerEnd: 50 } as any,
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    animation: { animateScale: true, animateRotate: true },
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card-lg flex flex-col items-center h-[400px]">
      <div className="w-full mb-4 shrink-0">
        <h3 className="text-lg font-bold text-gray-800">Engagement Rate Médio</h3>
      </div>
      <div className="relative w-full flex-1 flex items-center justify-center min-h-0">
        <Doughnut data={chartData} options={chartOptions as any} />
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-12 pointer-events-none">
          <span className="text-3xl font-extrabold text-gray-800">{averageEngagement.toFixed(1)}%</span>
          <span className="text-sm font-medium text-gray-500">Média Global</span>
        </div>
      </div>
    </div>
  );
}
