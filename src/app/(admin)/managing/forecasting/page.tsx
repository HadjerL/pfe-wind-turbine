// app/managing/graphical/forecast/page.tsx
'use client';
import { useMemo } from 'react';
import { useDataStore } from "@/app/lib/dataStore";
import { 
  ForecastComparisonBarChart, 
  ForecastHorizonChart, 
  ForecastTimeSeriesChart,
  
} from '@/app/ui/admin/graphs/forecast-charts';

export default function ForecastEvaluationPage() {
  const forecastEvaluation = useDataStore((state) => state.forecastEvaluation);
  console.log("🚀 ~ ForecastEvaluationPage ~ forecastEvaluation:", forecastEvaluation)

  // Prepare data for model comparison bar chart
  const modelComparisonData = useMemo(() => {
    if (!forecastEvaluation?.results) return null;

    const models = Object.keys(forecastEvaluation.results);
    const metrics = ['mae', 'mse', 'rmse', 'r2'];
    return {
      labels: metrics.map(metric => metric.toUpperCase()),
      datasets: models.map((model, index) => {
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
        const overall = forecastEvaluation.results[model].overall_metrics;
        console.log(overall);
        return {
          label: model.toUpperCase(),
          data: [
            overall.mae,
            overall.mse,
            overall.rmse,
            overall.r2,
          ],
          backgroundColor: colors[index],
        };
      }),
    };
  }, [forecastEvaluation]);

  // Prepare data for time series visualization
  const timeSeriesData = useMemo(() => {
    if (!forecastEvaluation?.results) return null;

    const models = Object.entries(forecastEvaluation.results);
    if (models.length === 0) return null;

    // Use the first example from the first model (assuming all models have same test cases)
    const example = models[0][1].visualization_data?.[0];
    if (!example) return null;

    const inputTimestamps = example.input_sequence.timestamps;
    const inputValues = example.input_sequence.values;
    const predTimestamps = example.predicted_values.timestamps;
    const trueValues = example.true_values.values;

    // Define colors for each model
    const modelColors = [
      '#FF6384', // CNN
      '#36A2EB', // LSTM
      '#FFCE56', // RNN
      '#4BC0C0', // Current LSTM
      '#9966FF', // Additional model
    ];

    const datasets = [
    // Historical data
    {
      label: 'Historical Data',
      data: [...inputValues, ...Array(predTimestamps.length).fill(null)],
      borderColor: '#6B7280', // Muted gray for historical data
      backgroundColor: '#6B7280',
      borderWidth: 2,
      pointRadius: 2,
      borderDash: [8, 4], // More pronounced dashed line
    },
    // True values
    {
      label: 'True Values',
      data: [...Array(inputValues.length).fill(null), ...trueValues],
      borderColor: '#9966FF', // Emerald green, goes well with the rest
      backgroundColor: '#9966FF',
      borderWidth: 2,
      pointRadius: 2,
    },
      // Add predictions from each model
      ...models
        .map(([modelName, evaluation], index) => {
          // Get the first visualization example for this model
          const modelExample = evaluation.visualization_data?.[0];
          if (!modelExample) return undefined;

          return {
            label: `${modelName.toUpperCase()} Predictions`,
            data: [...Array(inputValues.length).fill(null), ...modelExample.predicted_values.values],
            borderColor: modelColors[index % modelColors.length],
            backgroundColor: modelColors[index % modelColors.length],
            borderWidth: 2,
            pointRadius: 2,
          } as {
            label: string;
            data: (number | null)[];
            borderColor: string;
            backgroundColor: string;
            borderWidth: number;
            pointRadius: number;
          };
        })
        .filter((dataset): dataset is {
          label: string;
          data: (number | null)[];
          borderColor: string;
          backgroundColor: string;
          borderWidth: number;
          pointRadius: number;
        } => dataset !== undefined),
    ];

    return {
      labels: [...inputTimestamps, ...predTimestamps],
      datasets,
    };
  }, [forecastEvaluation]);

  
  // Prepare data for horizon metrics chart
  const horizonMetricsData = useMemo(() => {
    if (!forecastEvaluation?.results) return null;

    const models = Object.entries(forecastEvaluation.results);
    const horizons = models[0][1].step_metrics.map(step => step.horizon);

    return {
      labels: horizons,
      datasets: models.map(([modelName, evaluation], index) => {
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
        return {
          label: modelName.toUpperCase(),
          data: evaluation.step_metrics.map(step => step.mae),
          borderColor: colors[index],
          backgroundColor: colors[index],
          borderWidth: 2,
        };
      }),
    };
  }, [forecastEvaluation]);

  if (!forecastEvaluation) {
    return (
      <div className="p-4 text-center text-gray-500">
        No forecast results available. Please run the forecasting process first.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {modelComparisonData && (
          <ForecastComparisonBarChart 
            data={modelComparisonData} 
            title="Forecast Model Comparison" 
          />
        )}
        
        {horizonMetricsData && (
          <ForecastHorizonChart 
            data={horizonMetricsData}
            title="MAE Across Forecast Horizons"
            metricName="Mean Absolute Error"
          />
        )}
      </div>

      {timeSeriesData && (
        <ForecastTimeSeriesChart 
          data={timeSeriesData} 
          title="Forecast Visualization" 
        />
      )}
    </div>
  );
}