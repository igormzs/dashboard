import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import type { ChartConfiguration } from 'chart.js';

interface GrowthChartProps {
  labels: string[];
  reachData: number[];
  followData: number[];
}

export function GrowthChart({ labels, reachData, followData }: GrowthChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const gradReach = ctx.createLinearGradient(0, 0, 0, 200);
    gradReach.addColorStop(0, 'rgba(245, 150, 82, 0.5)'); // #F59652 (Mild Orange)
    gradReach.addColorStop(1, 'rgba(255, 255, 255, 0.1)'); 

    const gradFollow = ctx.createLinearGradient(0, 0, 0, 200);
    gradFollow.addColorStop(0, 'rgba(230, 118, 38, 0.4)'); // #E67626 (Darker Orange)
    gradFollow.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          { label: 'Account Reached', data: reachData, borderColor: '#F59652', backgroundColor: gradReach, fill: true, tension: 0.4, yAxisID: 'y' },
          { label: 'Novos Seguidores', data: followData, borderColor: '#E67626', backgroundColor: gradFollow, fill: true, tension: 0.4, yAxisID: 'y1' }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8 } } },
        scales: {
          x: { grid: { display: false } },
          y: { type: 'linear', display: true, position: 'left', grid: { color: '#f0f0f0' }, border: { dash: [5, 5] }, beginAtZero: true },
          y1: { type: 'linear', display: true, position: 'right', grid: { display: false }, beginAtZero: true }
        }
      }
    };

    if (chartInstance.current) { chartInstance.current.destroy(); }
    chartInstance.current = new Chart(ctx, config);

    return () => { if (chartInstance.current) { chartInstance.current.destroy(); } };
  }, [labels, reachData, followData]);

  return (
    <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-card-lg flex flex-col h-[400px]">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-lg font-bold text-gray-800">Crescimento (Reach vs Seguidores)</h3>
      </div>
      <div className="flex-1 min-h-0 relative w-full overflow-hidden">
        <canvas ref={chartRef} className="absolute inset-0 w-full h-full object-contain"></canvas>
      </div>
    </div>
  );
}
