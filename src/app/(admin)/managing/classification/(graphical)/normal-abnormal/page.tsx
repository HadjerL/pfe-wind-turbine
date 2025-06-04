// app/managing/graphical/normal-abnormal/page.tsx
'use client';
import { useMemo } from 'react';
import { useDataStore } from "@/app/lib/dataStore";
import { ClassDistributionPieChart, ModelComparisonBarChart } from '@/app/ui/admin/graphs/Modelcharts';
import { ClassificationMetric } from '@/app/lib/definitions';

export default function NormalAbnormalEvaluationPage() {
  const tuningResults = useDataStore((state) => state.tuningResults);

  // Prepare data for model comparison bar chart
  const modelComparisonData = useMemo(() => {
    if (!tuningResults) return null;

    const models = Object.keys(tuningResults.evaluation);
    const metrics = ['accuracy', 'precision', 'recall', 'f1-score'];

    return {
      labels: metrics,
      datasets: models.map((model, index) => {
        const colors = ['#FF6384', '#36A2EB', '#FFCE56'];
        const evaluation = tuningResults.evaluation[model].evaluate_normal_vs_abnormal;
        const normalMetrics = typeof evaluation.classification_report.Normal === 'object' && evaluation.classification_report.Normal !== null
          ? evaluation.classification_report.Normal as ClassificationMetric
          : undefined;
        const abnormalMetrics = typeof evaluation.classification_report.Abnormal === 'object' && evaluation.classification_report.Abnormal !== null
          ? evaluation.classification_report.Abnormal as ClassificationMetric
          : undefined;

        // Ensure metrics are objects before accessing properties
        const getMetricValue = (
          metric: ClassificationMetric | undefined,
          key: 'precision' | 'recall' | 'f1-score'
        ): number => metric ? metric[key] as number : 0;

        return {
          label: model.toUpperCase(),
          data: [
            evaluation.accuracy,
            (getMetricValue(normalMetrics, 'precision') + getMetricValue(abnormalMetrics, 'precision')) / 2,
            (getMetricValue(normalMetrics, 'recall') + getMetricValue(abnormalMetrics, 'recall')) / 2,
            (getMetricValue(normalMetrics, 'f1-score') + getMetricValue(abnormalMetrics, 'f1-score')) / 2
          ],
          backgroundColor: colors[index],
        };
      }),
    };
  }, [tuningResults]);

  // Prepare data for class distribution pie chart
  const classDistributionData = useMemo(() => {
    if (!tuningResults) return null;

    const firstModel = Object.values(tuningResults.evaluation)[0].evaluate_normal_vs_abnormal;
    const classes = ['Normal', 'Abnormal'];
    const supports = [
      typeof firstModel.classification_report.Normal === 'object' && firstModel.classification_report.Normal !== null
        ? firstModel.classification_report.Normal.support
        : 0,
      typeof firstModel.classification_report.Abnormal === 'object' && firstModel.classification_report.Abnormal !== null
        ? firstModel.classification_report.Abnormal.support
        : 0
    ];

    const colors = ['#4BC0C0', '#FF6384'];

    return {
      labels: classes,
      datasets: [{
        label: 'Support',
        data: supports,
        backgroundColor: colors,
      }],
    };
  }, [tuningResults]);

  if (!tuningResults) {
    return (
      <div className="p-4 text-center text-gray-500">
        No tuning results available. Please run the tuning process first.
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6">
      {modelComparisonData && (
        <ModelComparisonBarChart 
          data={modelComparisonData} 
          title="Normal vs Abnormal Model Comparison" 
        />
      )}
      
      {classDistributionData && (
        <ClassDistributionPieChart
          data={classDistributionData} 
          title="Normal vs Abnormal Distribution" 
        />
      )}
    </div>
  );
}