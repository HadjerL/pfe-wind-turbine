'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { useDataStore } from '@/app/lib/dataStore';
import { DataPoint, ForecastHyperparameters, ForecastModelEvaluation, HyperparameterConfig } from '@/app/lib/definitions';
import { ModelConfigForm } from './forecasting_model_conf';

const REQUIRED_COLUMNS = [
  'Timestamp',
  'Power_Output'
];

export default function ForecastUploader() {
    const uploadedData = useDataStore((state) => state.uploadedData);
    // const forecastEvaluation = useDataStore((state) => state.forecastEvaluation);
    const setUploadedData = useDataStore((state) => state.setUploadedData);
    const setForecastEvaluation = useDataStore((state) => state.setForecastEvaluation);
    const clearForecastEvaluation = useDataStore((state) => state.clearForecastEvaluation);

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showNewModelForm, setShowNewModelForm] = useState(false);

    const validateColumns = (headers: string[]): boolean => {
        const missingColumns = REQUIRED_COLUMNS.filter(
            (column) => !headers.includes(column)
        );

        if (missingColumns.length > 0) {
            setError(`Missing required columns: ${missingColumns.join(', ')}`);
            setUploadedData([]);
            return false;
        }
        return true;
    };

    // const fetchModelTuning = async () => {
    //     if (uploadedData.length === 0) {
    //         setError('No data to evaluate');
    //         return;
    //     }

    //     setIsLoading(true);
    //     clearForecastEvaluation();
        
    //     try {
    //         const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    //         const response = await fetch(`${backendUrl}/tune_forecast`, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(uploadedData),
    //         });

    //         if (!response.ok) {
    //             const errorText = await response.text();
    //             throw new Error(`Failed to evaluate forecast: ${errorText}`);
    //         }

    //         const results = await response.json();
    //         setForecastEvaluation(results);
    //     } catch (err) {
    //         setError(
    //             `Error evaluating forecast: ${
    //                 err instanceof Error ? err.message : 'Unknown error'
    //             }`
    //         );
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const saveForecastResults = async (
      modelName: string,
      modelType: string,
      architecture: string,
      hyperparameters: ForecastHyperparameters,
      evaluation: ForecastModelEvaluation,
      forecastHorizon: number
    ) => {
      const response = await fetch('/api/models/forecasting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: modelName,
          modelType,
          architecture,
          hyperparameters,
          evaluation,
          forecastHorizon
        }),
      });
    
      if (!response.ok) {
        throw new Error('Failed to save forecast results');
      }
      return await response.json();
    };
    const fetchNewModelTraining = async (config: HyperparameterConfig) => {
            if (uploadedData.length === 0) {
                setError('No data to train on');
                return;
            }

        
        setIsLoading(true);
        clearForecastEvaluation();
        setError(null);
        
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${backendUrl}/train_new_forecast_model`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: uploadedData,
                    config
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to train new model: ${errorText}`);
            }

            const results = await response.json();
            console.log("🚀 ~ fetchNewModelTraining ~ results:", results)
            setForecastEvaluation(results);
            if (results.hyperparameters && results.results) {
              const modelName = Object.keys(results.results)[0];
              console.log({
                'a':modelName,
                'b':results.hyperparameters.model_type || '', // Provide modelType, adjust as needed
                'c':results.hyperparameters.architecture,
                'd':results.hyperparameters,
                'e':results.results[modelName],
                'f':results.forecast_horizon
              });
              await saveForecastResults(
                modelName,
                results.hyperparameters.model_type || '', // Provide modelType, adjust as needed
                results.hyperparameters.architecture,
                results.hyperparameters,
                results.results[modelName],
                results.forecast_horizon
              );
            }
        } catch (err) {
            setError(
                `Error training model: ${
                    err instanceof Error ? err.message : 'Unknown error'
                }`
            );
        } finally {
            setIsLoading(false);
            setShowNewModelForm(false);
        }
    };

    // const handleTuneModels = () => {
    //     setError(null);
    //     fetchModelTuning();
    // };

    const handleFileParse = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        clearForecastEvaluation();
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: (header) => header !== 'Timestamp',
            complete: (result) => {
                if (result.errors.length) {
                    setError('Error parsing CSV file.');
                    return;
                }

                if (!validateColumns(result.meta.fields || [])) {
                    return;
                }

                const parsedData: DataPoint[] = result.data as DataPoint[];
                setUploadedData(parsedData);
            },
            error: (err) => setError(`Parsing error: ${err.message}`),
        });
    };

    return (
        <div className="space-y-4">
            <div className="p-4 border rounded shadow">
                <h2 className="text-lg font-bold mb-2 text-primary">Upload CSV File</h2>
                <div className="flex flex-col md:flex-row gap-5">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileParse}
                        className="border p-2 rounded bg-slate-100 w-full md:w-fit"
                        disabled={isLoading}
                    />
                </div>
                {isLoading && (
                    <p className="text-blue-500 mt-2 animate-pulse">Processing file... Please wait.</p>
                )}
                {error && <p className="text-red-500 mt-2">{error}</p>}

                <div className="mt-4 flex gap-4">
                    <button
                        onClick={() => setShowNewModelForm(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                        disabled={isLoading || uploadedData.length === 0}
                    >
                        Train New Model
                    </button>
                    
                    {/* <button
                        onClick={handleTuneModels}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                        disabled={isLoading || uploadedData.length === 0}
                    >
                        Tune Existing Models
                    </button> */}
                </div>
            </div>

            {showNewModelForm && (
                <ModelConfigForm
                    onSubmit={(config) => {
                        // Ensure only allowed optimizers are passed
                        const allowedOptimizers = ['adam', 'sgd', 'rmsprop'] as const;
                        const safeConfig = {
                            ...config,
                            optimizers: (config.optimizers as string[]).filter((opt): opt is typeof allowedOptimizers[number] =>
                                allowedOptimizers.includes(opt as typeof allowedOptimizers[number])
                            ),
                        };
                        fetchNewModelTraining(safeConfig);
                    }}
                />
            )}
        </div>
    );
}