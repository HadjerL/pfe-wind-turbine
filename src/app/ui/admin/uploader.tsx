'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { useDataStore } from '@/app/lib/dataStore';
import { DataPoint } from '@/app/lib/definitions';

const REQUIRED_COLUMNS = [
  'Timestamp',
  'Asset_ID',
  'Status_Type',
  'Rotor_Speed',
  'Rotational_Speed',
  'Gearbox_Oil_Inlet_Temperature',
  'RMS_Current_Phase_1_HV_Grid',
  'RMS_Current_Phase_2_HV_Grid',
  'RMS_Current_Phase_3_HV_Grid',
  'RMS_Voltage_Phase_1_HV_Grid',
  'RMS_Voltage_Phase_2_HV_Grid',
  'RMS_Voltage_Phase_3_HV_Grid',
  'Min_Pitch_Angle',
  'Rotor_Bearing_Temperature',
  'Outside_Temperature',
  'Wind_Speed',
  'Power_Output',
  'Wind_Direction_Sin',
  'Wind_Direction_Cos',
  'Communication',
  'Electrical system',
  'Gearbox',
  'Hydraulic system',
  'Pitch system',
  'Yaw system',	
  'other'
];

export default function Uploader() {
    const uploadedData = useDataStore((state) => state.uploadedData);
    const tuna = useDataStore((state) => state.tuningResults);
    console.log("🚀 ~ Uploader ~ tuna:", tuna)
    const setUploadedData = useDataStore((state) => state.setUploadedData);
    const setTuningResults = useDataStore((state) => state.setTuningResults);
    const clearTuningResults = useDataStore((state) => state.clearTuningResults);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateColumns = (headers: string[]): boolean => {
    const missingColumns = REQUIRED_COLUMNS.filter(
      (column) => !headers.includes(column)
    );

    if (missingColumns.length > 0) {
      setError(`Missing required columns: ${missingColumns.join(', ')}`);
      setUploadedData([]); // Clear uploaded data if validation fails
      return false;
    }

    return true;
  };

  const fetchModelTuning = async (data: DataPoint[]) => {
    setIsLoading(true);
    clearTuningResults();
    console.log(data);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/tune_models`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to tune and evaluate models: ${errorText}`);
      }

      const tuningResults = await response.json();
      setTuningResults(tuningResults);
      console.log('Model Tuning Results:', tuningResults);
      // Add UI updates to display results if needed
    } catch (err) {
      setError(
        `Error tuning models: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTuneModels = () => {
    setError(null);
    fetchModelTuning(uploadedData);
  };

  const handleFileParse = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    clearTuningResults();
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

        // Validate columns before proceeding
        if (!validateColumns(result.meta.fields || [])) {
          return;
        }

        const parsedData: DataPoint[] = result.data as DataPoint[];
        setUploadedData(parsedData); // Set parsed data to the uploadedData store
      },
      error: (err) => setError(`Parsing error: ${err.message}`),
    });
  };

  return (
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

      <div className="mt-4">
        <button
          onClick={handleTuneModels}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isLoading || uploadedData.length === 0}
        >
          Tune Classification Models
        </button>
      </div>
    </div>
  );
}
