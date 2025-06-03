import { useState } from 'react';

interface ClassificationMetric {
  precision: number;
  recall: number;
  'f1-score': number;
  support: number;
}

interface ClassificationReport {
  [key: string]: ClassificationMetric | number | string;
}

interface PairMetric {
  pair: string;
  precision: number;
  recall: number;
  f1_score: number;
  support: number;
}

interface ModelEvaluation {
  class_pair_evaluation: {
    accuracy_two_active: number | null;
    pair_metrics: PairMetric[];
  };
  evaluate_normal_vs_abnormal: {
    accuracy: number;
    classification_report: ClassificationReport;
  };
  evaluate_single_class: {
    accuracy: number | null;
    classification_report: ClassificationReport | null;
    message?: string;
  };
  multi_label_evaluation: {
    accuracy: number;
    classification_report: ClassificationReport;
  };
}

interface TuningResults {
  evaluation: {
    [modelName: string]: ModelEvaluation;
  };
  message: string;
}

export function ModelTuningResults({ results }: { results: TuningResults }) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Model Tuning Results</h1>
      
      <div className="flex space-x-8">
        {Object.entries(results.evaluation).map(([modelName, evaluation]) => (
          <div key={modelName} className="bg-white w-full rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-primary capitalize">{modelName} Model</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {/* Multi-label Evaluation */}
              <div className="p-6">
                <button 
                  onClick={() => toggleSection(`${modelName}-multi-label`)}
                  className="flex justify-between items-center w-full text-left"
                >
                  <h3 className="text-xl font-medium text-gray-700">Multi-label Evaluation</h3>
                  <span className="text-gray-500">
                    {expandedSections[`${modelName}-multi-label`] ? '−' : '+'}
                  </span>
                </button>
                
                <div className="mt-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Accuracy:</span> {evaluation.multi_label_evaluation.accuracy.toFixed(4)}
                  </p>
                </div>
                
                {expandedSections[`${modelName}-multi-label`] && (
                  <div className="mt-4">
                    <ClassificationReport 
                      report={evaluation.multi_label_evaluation.classification_report} 
                    />
                  </div>
                )}
              </div>
              
              {/* Class Pair Evaluation */}
              <div className="p-6">
                <button 
                  onClick={() => toggleSection(`${modelName}-pair`)}
                  className="flex justify-between items-center w-full text-left"
                >
                  <h3 className="text-xl font-medium text-gray-700">Class Pair Evaluation</h3>
                  <span className="text-gray-500">
                    {expandedSections[`${modelName}-pair`] ? '−' : '+'}
                  </span>
                </button>
                
                <div className="mt-2">
                  {evaluation.class_pair_evaluation.accuracy_two_active !== null && (
                    <p className="text-gray-600">
                      <span className="font-medium">Accuracy (Two Active Classes):</span> {evaluation.class_pair_evaluation.accuracy_two_active.toFixed(4)}
                    </p>
                  )}
                </div>
                
                {expandedSections[`${modelName}-pair`] && (
                  <div className="mt-4">
                    <PairMetrics 
                      metrics={evaluation.class_pair_evaluation.pair_metrics} 
                    />
                  </div>
                )}
              </div>
              
              {/* Single Class Evaluation */}
              <div className="p-6">
                <button 
                  onClick={() => toggleSection(`${modelName}-single`)}
                  className="flex justify-between items-center w-full text-left"
                >
                  <h3 className="text-xl font-medium text-gray-700">Single Class Evaluation</h3>
                  <span className="text-gray-500">
                    {expandedSections[`${modelName}-single`] ? '−' : '+'}
                  </span>
                </button>
                
                {evaluation.evaluate_single_class.message ? (
                  <p className="mt-2 text-gray-600">{evaluation.evaluate_single_class.message}</p>
                ) : (
                  <>
                    <div className="mt-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Accuracy:</span> {evaluation.evaluate_single_class.accuracy?.toFixed(4) ?? 'N/A'}
                      </p>
                    </div>
                    
                    {expandedSections[`${modelName}-single`] && evaluation.evaluate_single_class.classification_report && (
                      <div className="mt-4">
                        <ClassificationReport 
                          report={evaluation.evaluate_single_class.classification_report} 
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Normal vs Abnormal Evaluation */}
              <div className="p-6">
                <button 
                  onClick={() => toggleSection(`${modelName}-normal`)}
                  className="flex justify-between items-center w-full text-left"
                >
                  <h3 className="text-xl font-medium text-gray-700">Normal vs Abnormal Evaluation</h3>
                  <span className="text-gray-500">
                    {expandedSections[`${modelName}-normal`] ? '−' : '+'}
                  </span>
                </button>
                
                <div className="mt-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Accuracy:</span> {evaluation.evaluate_normal_vs_abnormal.accuracy.toFixed(4)}
                  </p>
                </div>
                
                {expandedSections[`${modelName}-normal`] && (
                  <div className="mt-4">
                    <ClassificationReport 
                      report={evaluation.evaluate_normal_vs_abnormal.classification_report} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClassificationReport({ report }: { report: ClassificationReport }) {
  const classes = Object.keys(report).filter(key => 
    typeof report[key] === 'object' && 'precision' in (report[key] as ClassificationMetric)
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Class
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precision
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recall
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              F1-Score
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Support
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {classes.map((className) => {
            const metric = report[className] as ClassificationMetric;
            return (
              <tr key={className}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {className}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {metric.precision.toFixed(3)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {metric.recall.toFixed(3)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {metric['f1-score'].toFixed(3)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {metric.support}
                </td>
              </tr>
            );
          })}
          
          {/* Show macro/micro/weighted averages if they exist */}
          {['macro avg', 'micro avg', 'weighted avg'].map(avgType => {
            if (report[avgType] && typeof report[avgType] === 'object') {
              const metric = report[avgType] as ClassificationMetric;
              return (
                <tr key={avgType} className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {avgType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {metric.precision?.toFixed(3)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {metric.recall?.toFixed(3)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {metric['f1-score']?.toFixed(3)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {metric.support}
                  </td>
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>
    </div>
  );
}

function PairMetrics({ metrics }: { metrics: PairMetric[] }) {
  if (metrics.length === 0) {
    return <p className="text-gray-500 italic">No pair metrics available</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pair
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precision
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recall
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              F1-Score
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Support
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {metrics.map((metric) => (
            <tr key={metric.pair}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {metric.pair}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                {metric.precision.toFixed(3)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                {metric.recall.toFixed(3)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                {metric.f1_score.toFixed(3)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                {metric.support}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}