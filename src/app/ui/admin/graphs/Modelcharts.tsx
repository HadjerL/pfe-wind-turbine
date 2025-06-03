// app/ui/modelCharts.tsx
'use client';
import dynamic from "next/dynamic";
import { useRef } from "react";
import 'chart.js/auto';
import { Chart as ChartJS } from 'chart.js';
import DownloadBarButton from "../../dashboard/download-bar-button";
import DownloadPieButton from "../../dashboard/download-pie-button";

const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), {
  ssr: false,
});

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
  ssr: false,
});

interface ModelComparisonBarChartProps {
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

interface ClassDistributionPieChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
  title: string;
}

export function ModelComparisonBarChart({ data, title }: ModelComparisonBarChartProps) {
  const chartRef = useRef<ChartJS<'bar'> | null>(null);

  return (
    <div className=" w-2/3 shadow-md rounded-lg">
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
                max: 1,
                title: {
                  display: true,
                  text: 'Score',
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

export function ClassDistributionPieChart({ data, title }: ClassDistributionPieChartProps) {
  const chartRef = useRef<ChartJS<'pie'> | null>(null);

  return (
    <div className="w-1/3 shadow-md rounded-lg">
      <div className="bg-slate-100 p-4 flex flex-row justify-between">
        <h1 className="text-sm font-bold">{title}</h1>
        <DownloadPieButton chartRef={chartRef} filename={`${title.replace(/\s+/g, '-').toLowerCase()}.png`} />
      </div>
      <div className="p-4 flex items-center justify-center">
        <div className="w-96 h-96">
          <Pie
            ref={chartRef}
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right' as const,
                  labels: {
                    font: {
                      size: 10,
                    },
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.label || '';
                      const value = context.raw as number;
                      return `${label}: ${value}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}