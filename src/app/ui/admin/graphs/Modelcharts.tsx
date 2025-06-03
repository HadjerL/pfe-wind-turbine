// app/ui/admin/modelCharts.tsx
'use client';
import dynamic from "next/dynamic";
import { useMemo, useRef } from "react";
import 'chart.js/auto';
import { useDataStore } from "@/app/lib/dataStore";
import { Chart as ChartJS } from 'chart.js';
import DownloadBarButton from "../../dashboard/download-bar-button";
import DownloadPieButton from "../../dashboard/download-pie-button";

const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), {
  ssr: false,
});

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
  ssr: false,
});

type ModelMetrics = {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  support: number;
};

type EvaluationType = 'multi_label' | 'normal_abnormal' | 'single_class' | 'class_pair';

export default function ModelCharts({ evaluationType }: { evaluationType: EvaluationType }) {
  const tuningResults = useDataStore((state) => state.tuningResults);
  const pieChartRef = useRef<ChartJS<'pie'> | null>(null);
  const barChartRef = useRef<ChartJS<'bar'> | null>(null);

  // Extract model metrics based on evaluation type
  const modelMetrics = useMemo<ModelMetrics[] | null>(() => {
    if (!tuningResults) return null;

    return Object.entries(tuningResults.evaluation).map(([modelName, evaluation]) => {
      let metrics: Omit<ModelMetrics, 'name'> = {
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1_score: 0,
        support: 0,
      };

      switch(evaluationType) {
        case 'multi_label': {
          type ClassificationReportEntry = {
            precision?: number;
            recall?: number;
            'f1-score'?: number;
            support?: number;
          };
          const multiLabelReport = evaluation.multi_label_evaluation.classification_report;
          const weightedAvg = multiLabelReport?.['weighted avg'] as ClassificationReportEntry | undefined;
          metrics = {
            accuracy: evaluation.multi_label_evaluation.accuracy,
            precision: typeof weightedAvg === 'object' && weightedAvg !== null
              ? weightedAvg.precision ?? 0
              : 0,
            recall: typeof weightedAvg === 'object' && weightedAvg !== null
              ? weightedAvg.recall ?? 0
              : 0,
            f1_score: typeof weightedAvg === 'object' && weightedAvg !== null
              ? weightedAvg['f1-score'] ?? 0
              : 0,
            support: typeof weightedAvg === 'object' && weightedAvg !== null
              ? weightedAvg.support ?? 0
              : 0,
          };
          break;
        }
        case 'normal_abnormal': {
          const normalAbnormalReport = evaluation.evaluate_normal_vs_abnormal.classification_report;
          metrics = {
            accuracy: evaluation.evaluate_normal_vs_abnormal.accuracy,
            precision: typeof normalAbnormalReport?.['weighted avg'] === 'object' && normalAbnormalReport?.['weighted avg'] !== null
              ? (normalAbnormalReport['weighted avg'] as { precision?: number }).precision ?? 0
              : 0,
            recall: typeof normalAbnormalReport?.['weighted avg'] === 'object' && normalAbnormalReport?.['weighted avg'] !== null
              ? (normalAbnormalReport['weighted avg'] as { recall?: number }).recall ?? 0
              : 0,
            f1_score: typeof normalAbnormalReport?.['weighted avg'] === 'object' && normalAbnormalReport?.['weighted avg'] !== null
              ? (normalAbnormalReport['weighted avg'] as { 'f1-score'?: number })['f1-score'] ?? 0
              : 0,
            support: typeof normalAbnormalReport?.['weighted avg'] === 'object' && normalAbnormalReport?.['weighted avg'] !== null
              ? (normalAbnormalReport['weighted avg'] as { support?: number }).support ?? 0
              : 0,
          };
          break;
        }
        case 'single_class': {
          const singleClassReport = evaluation.evaluate_single_class.classification_report;
          metrics = {
            accuracy: evaluation.evaluate_single_class.accuracy ?? 0,
            precision: typeof singleClassReport?.['weighted avg'] === 'object' && singleClassReport?.['weighted avg'] !== null
              ? (singleClassReport['weighted avg'] as { precision?: number }).precision ?? 0
              : 0,
            recall: typeof singleClassReport?.['weighted avg'] === 'object' && singleClassReport?.['weighted avg'] !== null
              ? (singleClassReport['weighted avg'] as { recall?: number }).recall ?? 0
              : 0,
            f1_score: typeof singleClassReport?.['weighted avg'] === 'object' && singleClassReport?.['weighted avg'] !== null
              ? (singleClassReport['weighted avg'] as { 'f1-score'?: number })['f1-score'] ?? 0
              : 0,
            support: typeof singleClassReport?.['weighted avg'] === 'object' && singleClassReport?.['weighted avg'] !== null
              ? (singleClassReport['weighted avg'] as { support?: number }).support ?? 0
              : 0,
          };
          break;
        }
        case 'class_pair': {
          // For class pair, we'll use the average of pair metrics
          const pairMetrics = evaluation.class_pair_evaluation.pair_metrics;
          const avgPairMetrics = pairMetrics.reduce((acc, curr) => ({
            precision: acc.precision + curr.precision,
            recall: acc.recall + curr.recall,
            f1_score: acc.f1_score + curr.f1_score,
            support: acc.support + curr.support,
          }), { precision: 0, recall: 0, f1_score: 0, support: 0 });

          const count = pairMetrics.length || 1;
          metrics = {
            accuracy: evaluation.class_pair_evaluation.accuracy_two_active ?? 0,
            precision: avgPairMetrics.precision / count,
            recall: avgPairMetrics.recall / count,
            f1_score: avgPairMetrics.f1_score / count,
            support: avgPairMetrics.support / count,
          };
          break;
        }
        default:
          // metrics already initialized to zeros
          break;
      }

      return {
        name: modelName,
        ...metrics
      };
    });
  }, [tuningResults, evaluationType]);

  // Prepare data for metrics comparison bar chart
  const barChartData = useMemo(() => {
    if (!modelMetrics || modelMetrics.length === 0) return null;

    return {
      labels: modelMetrics.map(model => model.name),
      datasets: [
        {
          label: 'Accuracy',
          data: modelMetrics.map(model => model.accuracy),
          backgroundColor: '#FF6384',
        },
        {
          label: 'Precision',
          data: modelMetrics.map(model => model.precision),
          backgroundColor: '#36A2EB',
        },
        {
          label: 'Recall',
          data: modelMetrics.map(model => model.recall),
          backgroundColor: '#FFCE56',
        },
        {
          label: 'F1 Score',
          data: modelMetrics.map(model => model.f1_score),
          backgroundColor: '#4BC0C0',
        },
      ],
    };
  }, [modelMetrics]);

  // Prepare data for support distribution pie chart
  const pieChartData = useMemo(() => {
    if (!modelMetrics || modelMetrics.length === 0) return null;

    return {
      labels: modelMetrics.map(model => model.name),
      datasets: [
        {
          label: 'Support Distribution',
          data: modelMetrics.map(model => model.support),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
          ],
          hoverBackgroundColor: [
            '#FF6384DD',
            '#36A2EBDD',
            '#FFCE56DD',
            '#4BC0C0DD',
            '#9966FFDD',
          ],
        },
      ],
    };
  }, [modelMetrics]);

  if (!tuningResults) {
    return (
      <div className="shadow-md rounded-lg">
        <div className="bg-slate-100 p-4">
          <h1 className="text-sm font-bold text-center">Model Evaluation Visualization</h1>
        </div>
        <div className="p-4 text-center text-gray-500">
          No tuning results available. Please run the tuning process first.
        </div>
      </div>
    );
  }

  const getEvaluationTitle = () => {
    switch(evaluationType) {
      case 'multi_label': return 'Multi-label Evaluation';
      case 'normal_abnormal': return 'Normal vs Abnormal Evaluation';
      case 'single_class': return 'Single Class Evaluation';
      case 'class_pair': return 'Class Pair Evaluation';
      default: return 'Model Evaluation';
    }
  };

  return (
    <div className="space-y-8">
      {/* Metrics Comparison Bar Chart */}
      <div className="shadow-md rounded-lg">
        <div className="bg-slate-100 p-4 flex flex-row justify-between">
          <h1 className="text-sm font-bold">{getEvaluationTitle()} - Metrics Comparison</h1>
          {barChartData && <DownloadBarButton chartRef={barChartRef} filename={`${evaluationType}-metrics-comparison.png`} />}
        </div>
        <div className="p-4 h-96">
          {barChartData ? (
            <Bar
              ref={barChartRef}
              data={barChartData}
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
                      text: 'Models',
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
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          )}
        </div>
      </div>

      {/* Support Distribution Pie Chart */}
      <div className="shadow-md rounded-lg">
        <div className="bg-slate-100 p-4 flex flex-row justify-between">
          <h1 className="text-sm font-bold">{getEvaluationTitle()} - Support Distribution</h1>
          {pieChartData && <DownloadPieButton chartRef={pieChartRef} filename={`${evaluationType}-support-distribution.png`} />}
        </div>
        <div className="p-4 flex items-center justify-center">
          {pieChartData ? (
            <div className="w-96 h-96">
              <Pie
                ref={pieChartRef}
                data={pieChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right' as const,
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.raw as number;
                          return `${label}: ${value.toFixed(0)} samples`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div className="w-96 h-96 flex items-center justify-center">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}