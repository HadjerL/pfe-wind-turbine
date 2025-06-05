// app/ui/forecastCharts.tsx
'use client';
import dynamic from "next/dynamic";
import { useRef } from "react";
import 'chart.js/auto';
import { Chart as ChartJS } from 'chart.js';
import DownloadLineButton from "../../dashboard/download-line-button";
import DownloadBarButton from "../../dashboard/download-bar-button";

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
  ssr: false,
});

interface ForecastComparisonBarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
  title: string;
}

interface ForecastTimeSeriesChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      borderWidth: number;
      pointRadius: number;
    }[];
  };
  title: string;
}

interface ForecastHorizonChartProps {
  data: {
    labels: number[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      borderWidth: number;
    }[];
  };
  title: string;
  metricName: string;
}

export function ForecastComparisonBarChart({ data, title }: ForecastComparisonBarChartProps) {
  const chartRef = useRef<ChartJS<'bar'> | null>(null);

  return (
    <div className="shadow-md rounded-lg">
      <div className="bg-slate-100 p-4 flex flex-row justify-between">
        <h1 className="text-sm font-bold">{title}</h1>
        <DownloadBarButton chartRef={chartRef} filename={`${title.replace(/\s+/g, '-').toLowerCase()}.png`} />
      </div>
      <div className="p-4 h-96">
        <Bar
          ref={chartRef}
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Metric Value',
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Metrics',
                },
              },
            },
            plugins: {
              legend: {
                position: 'top' as const,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.dataset.label || '';
                    const value = context.raw as number;
                    return `${label}: ${value.toFixed(4)}`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export function ForecastTimeSeriesChart({ data, title }: ForecastTimeSeriesChartProps) {
  const chartRef = useRef<ChartJS<'line'> | null>(null);

  return (
    <div className="shadow-md rounded-lg">
      <div className="bg-slate-100 p-4 flex flex-row justify-between">
        <h1 className="text-sm font-bold">{title}</h1>
        <DownloadLineButton chartRef={chartRef} filename={`${title.replace(/\s+/g, '-').toLowerCase()}.png`} />
      </div>
      <div className="p-4 h-96">
        <Line
          ref={chartRef}
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Timestamp',
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 45,
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Power Output',
                },
              },
            },
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export function ForecastHorizonChart({ data, title, metricName }: ForecastHorizonChartProps) {
  const chartRef = useRef<ChartJS<'line'> | null>(null);

  return (
    <div className="shadow-md rounded-lg">
      <div className="bg-slate-100 p-4 flex flex-row justify-between">
        <h1 className="text-sm font-bold">{title}</h1>
        <DownloadLineButton chartRef={chartRef} filename={`${title.replace(/\s+/g, '-').toLowerCase()}.png`} />
      </div>
      <div className="p-4 h-96">
        <Line
          ref={chartRef}
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Forecast Horizon',
                },
              },
              y: {
                title: {
                  display: true,
                  text: metricName,
                },
              },
            },
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
          }}
        />
      </div>
    </div>
  );
}