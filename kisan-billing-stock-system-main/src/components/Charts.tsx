import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface StockDonutChartProps {
  wheatKg: number;
  paddyKg: number;
  totalKg: number;
}

export const StockDonutChart: React.FC<StockDonutChartProps> = ({
  wheatKg,
  paddyKg,
  totalKg
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Wheat', 'Paddy'],
        datasets: [
          {
            data: [wheatKg, paddyKg],
            backgroundColor: ['#eab308', '#10b981'], // Golden yellow & vibrant emerald
            borderWidth: 0,
            hoverOffset: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '76%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#062314',
            titleFont: { family: 'Plus Jakarta Sans', size: 12 },
            bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const val = context.raw as number;
                const pct = totalKg > 0 ? Math.round((val / totalKg) * 100) : 0;
                return ` ${context.label}: ${val.toLocaleString('en-IN')} kg (${pct}%)`;
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [wheatKg, paddyKg, totalKg]);

  return (
    <div className="relative w-44 h-44 sm:w-48 sm:h-48 mx-auto flex items-center justify-center">
      <canvas ref={canvasRef} />
      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          {totalKg.toLocaleString('en-IN')}
        </span>
        <span className="text-[11px] text-slate-400 font-medium">Total Stock (kg)</span>
      </div>
    </div>
  );
};

interface SalesVsPurchaseChartProps {
  salesTotal?: number;
  purchaseTotal?: number;
}

export const SalesVsPurchaseChart: React.FC<SalesVsPurchaseChartProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['01 May', '05 May', '10 May', '15 May', '20 May'],
        datasets: [
          {
            label: 'Sales',
            data: [90, 130, 155, 140, 170], // in thousands
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            borderWidth: 2.2,
            tension: 0.38,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4.5,
            pointHoverRadius: 6,
            fill: false
          },
          {
            label: 'Purchase',
            data: [50, 80, 100, 65, 95], // in thousands
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            borderWidth: 2.2,
            tension: 0.38,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4.5,
            pointHoverRadius: 6,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#062314',
            titleColor: '#e2e8f0',
            bodyColor: '#ffffff',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const val = (context.raw as number) * 1000;
                return ` ${context.dataset.label}: ₹ ${val.toLocaleString('en-IN')}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#94a3b8',
              font: {
                size: 11,
                family: 'Plus Jakarta Sans'
              }
            }
          },
          y: {
            min: 0,
            max: 200,
            ticks: {
              stepSize: 50,
              color: '#94a3b8',
              font: {
                size: 11,
                family: 'Plus Jakarta Sans'
              },
              callback: (value) => {
                return value === 0 ? '0' : `${value}K`;
              }
            },
            grid: {
              color: '#f1f5f9'
            },
            border: {
              dash: [4, 4]
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full h-48 sm:h-56 relative">
      <canvas ref={canvasRef} />
    </div>
  );
};
