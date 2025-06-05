// app/managing/graphical/class-pair/page.tsx
'use client';
import { useMemo } from 'react';
import { useDataStore } from "@/app/lib/dataStore";
import { ClassDistributionPieChart, ModelComparisonBarChart } from '@/app/ui/admin/graphs/Modelcharts';

export default function ClassPairEvaluationPage() {
  const tuningResults = useDataStore((state) => state.tuningResults);

  // Prepare data for model comparison bar chart
  const modelComparisonData = useMemo(() => {
    if (!tuningResults) return null;

    const models = Object.keys(tuningResults.evaluation);
    const metrics = ['accuracy', 'precision', 'recall', 'f1-score'];

    return {
      labels: metrics,
      datasets: models.map((model, index) => {
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
        const pairMetrics = tuningResults.evaluation[model].class_pair_evaluation.pair_metrics;
        
        // Calculate average metrics across all pairs
        const avgMetrics = pairMetrics.reduce((acc, curr) => {
          return {
            precision: acc.precision + curr.precision,
            recall: acc.recall + curr.recall,
            f1_score: acc.f1_score + curr.f1_score,
            count: acc.count + 1
          };
        }, { precision: 0, recall: 0, f1_score: 0, count: 0 });

        return {
          label: model.toUpperCase(),
          data: [
            tuningResults.evaluation[model].class_pair_evaluation.accuracy_two_active || 0,
            avgMetrics.precision / avgMetrics.count,
            avgMetrics.recall / avgMetrics.count,
            avgMetrics.f1_score / avgMetrics.count
          ],
          backgroundColor: colors[index],
        };
      }),
    };
  }, [tuningResults]);

  // Prepare data for class distribution pie chart
  const classDistributionData = useMemo(() => {
    if (!tuningResults) return null;

    const firstModel = Object.values(tuningResults.evaluation)[0].class_pair_evaluation;
    const pairs = firstModel.pair_metrics.map(pair => pair.pair);
    const supports = firstModel.pair_metrics.map(pair => pair.support);

    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8AC24A'
    ];

    return {
      labels: pairs,
      datasets: [{
        label: 'Support',
        data: supports,
        backgroundColor: colors.slice(0, pairs.length),
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
          title="Class Pair Model Comparison" 
        />
      )}
      
      {classDistributionData && (
        <ClassDistributionPieChart
          data={classDistributionData} 
          title="Class Pair Distribution" 
        />
      )}
    </div>
  );
}