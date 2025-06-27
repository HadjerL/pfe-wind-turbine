'use client';
// app/tuning/layout.tsx
import { useDataStore } from '@/app/lib/dataStore';
import { ForecastHyperparameters } from '@/app/lib/definitions';
import ModelInfo from '@/app/ui/admin/available-models';
import ForecastUploader from '@/app/ui/admin/forecast-uploader';
import ForecastResultsDisplay from '@/app/ui/admin/home/training/ForecastingHyperparametersDisplay';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const forecastingTuningResults = useDataStore((state) => state.forecastEvaluation);

  return (
    <div className="flex flex-col min-h-screen">
      <ForecastUploader />
      <ModelInfo models_type='forecasting'/>
      {forecastingTuningResults?.hyperparameters && (
        <ForecastResultsDisplay results={forecastingTuningResults.hyperparameters as ForecastHyperparameters} />
      )}
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}