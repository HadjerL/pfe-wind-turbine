// app/managing/graphical/multi-label/page.tsx
'use client';
import { useDataStore } from "@/app/lib/dataStore";
import { useMemo } from "react";
import { ClassDistributionPieChart, ModelComparisonBarChart } from "@/app/ui/admin/graphs/Modelcharts";

type ClassificationReportEntry = {
  precision: number;
  recall: number;
  'f1-score': number;
  support: number;
};

type ClassificationReport = {
  [label: string]: ClassificationReportEntry;
};

export default function MultiLabelEvaluationPage() {
  const tuningResults = useDataStore((state) => state.tuningResults);
  console.log("🚀 ~ MultiLabelEvaluationPage ~ tuningResults:", tuningResults)

  // Prepare data for model comparison bar chart
  const modelComparisonData = useMemo(() => {
    if (!tuningResults) return null;

    const models = Object.keys(tuningResults.evaluation);
    const metrics = ['accuracy', 'precision', 'recall', 'f1-score'];

    return {
      labels: metrics,
      datasets: models.map((model, index) => {
        console.log("🚀 ~ datasets:models.map ~ model:", model)
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
        const evaluation = tuningResults.evaluation[model].multi_label_evaluation;
        const classificationReport = evaluation.classification_report as ClassificationReport;
        const macroAvg = classificationReport['macro avg'];
        
        return {
          label: model.toUpperCase(),
          data: [
            evaluation.accuracy,
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

    const firstModel = Object.values(tuningResults.evaluation)[0].multi_label_evaluation;
    const classes = Object.keys(firstModel.classification_report)
      .filter(key => !['macro avg', 'micro avg', 'weighted avg', 'samples avg', 'accuracy'].includes(key));

    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8AC24A', 
      '#607D8B', '#9C27B0', '#E91E63', '#00BCD4', '#CDDC39'
    ];

    return {
      labels: classes,
      datasets: [{
        label: 'Support',
        data: classes.map(cls => (firstModel.classification_report[cls] as ClassificationReportEntry).support),
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
          title="Multi-label Model Comparison" 
        />
      )}
      
      {classDistributionData && (
        <ClassDistributionPieChart
          data={classDistributionData} 
          title="Multi-label Class Distribution" 
        />
      )}
    </div>
  );
}
