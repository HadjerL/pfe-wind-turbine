// app/managing/graphical/single-class/page.tsx
'use client';
import { useMemo } from 'react';
import { useDataStore } from "@/app/lib/dataStore";
import { ClassDistributionPieChart, ModelComparisonBarChart } from '@/app/ui/admin/graphs/Modelcharts';
import { ClassificationMetric, ClassificationReport } from '@/app/lib/definitions';

export default function SingleClassEvaluationPage() {
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
        const evaluation = tuningResults.evaluation[model].evaluate_single_class;
        
        if (!evaluation.classification_report) {
          return {
            label: model.toUpperCase(),
            data: [0, 0, 0, 0],
            backgroundColor: colors[index],
          };
        }

        const classificationReport = evaluation.classification_report as ClassificationReport;
        const macroAvg = classificationReport['macro avg'] as ClassificationMetric;
        
        return {
          label: model.toUpperCase(),
          data: [
            evaluation.accuracy || 0,
            macroAvg.precision,
            macroAvg.recall,
            macroAvg['f1-score']
          ],
          backgroundColor: colors[index],
        };
      }),
    };
  }, [tuningResults]);

  // Prepare data for class distribution pie chart
  const classDistributionData = useMemo(() => {
    if (!tuningResults) return null;

    const firstModel = Object.values(tuningResults.evaluation)[0].evaluate_single_class;
    if (!firstModel.classification_report) return null;

    const classes = Object.keys(firstModel.classification_report)
      .filter(key => !['macro avg', 'micro avg', 'weighted avg', 'samples avg', 'accuracy'].includes(key));

    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8AC24A', '#00BCD4'
    ];

    return {
      labels: classes,
      datasets: [{
        label: 'Support',
        data: classes.map(cls => {
          const report = firstModel.classification_report
            ? (firstModel.classification_report[cls] as ClassificationMetric)
            : { support: 0 };
          return report.support;
        }),
        backgroundColor: colors.slice(0, classes.length),
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
          title="Single Class Model Comparison" 
        />
      )}
      
      {classDistributionData && (
        <ClassDistributionPieChart 
          data={classDistributionData} 
          title="Single Class Distribution" 
        />
      )}
    </div>
  );
}