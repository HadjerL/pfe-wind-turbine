'use client';
// app/tuning/layout.tsx
import { useDataStore } from '@/app/lib/dataStore';
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
      <ModelInfo models_type='forecasting'/>
      <ForecastUploader />
      {forecastingTuningResults?.hyperparameters && (
        <ForecastResultsDisplay results={forecastingTuningResults} />
      )}
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}