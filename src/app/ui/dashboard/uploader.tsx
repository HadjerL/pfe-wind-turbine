'use client'
import { useState } from "react";
import Papa from 'papaparse'
import { useDataStore } from "@/app/lib/dataStore";
import { DataPoint, Classification, Forecast } from "@/app/lib/definitions";
import CSVUploader from "./csv-uploader";

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
    'Nacelle_Air_Pressure',
    'Wind_Direction_Sin',
    'Wind_Direction_Cos'
];

const MINIMUM_ROWS = 576 / 2; // Minimum required rows of data

export default function Uploader() {
    // const forecast = useDataStore((state) => state.forecast);
    const setDataPoints = useDataStore((state) => state.setData);
    const setClassifications = useDataStore((state) => state.setClassifications);
    const setForecast = useDataStore((state) => state.setForecast);
    
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateColumns = (headers: string[]): boolean => {
        const missingColumns = REQUIRED_COLUMNS.filter(
            column => !headers.includes(column)
        );
        
        if (missingColumns.length > 0) {
            setError(`Missing required columns: ${missingColumns.join(', ')}`);
            setDataPoints([]);
            setClassifications([]);
            setForecast([]);
            return false;
        }
        
        return true;
    };

    const validateRowCount = (data: DataPoint[]): boolean => {
        if (data.length < MINIMUM_ROWS) {
            setError(`File must contain at least ${MINIMUM_ROWS} rows of data. Found only ${data.length} rows.`);
            setDataPoints([]);
            setClassifications([]);
            setForecast([]);
            return false;
        }
        return true;
    };

    const fetchClassifications = async (data: DataPoint[]) => {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            const response = await fetch("http://192.168.1.33:5000/predict", {
            // const response = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok){ 
                const errorText = await response.text();
                console.log("🚀 ~ fetchClassifications ~ errorText:", errorText)
                throw new Error("Failed to fetch classifications")
            };

            const classificationResult: Classification[] = await response.json();
            setClassifications(classificationResult);
                
        } catch (err) {
            setError("Error fetching classification data: " + (err instanceof Error ? err.message : "Unknown error"));
            setClassifications([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchForecast = async (data: DataPoint[]) => {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            const res = await fetch("http://192.168.1.33:5000/predict_forecast", {
            // const res = await fetch("http://127.0.0.1:5000/predict_forecast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data.slice(-MINIMUM_ROWS)), // Send only the most recent 576 rows
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.log("🚀 ~ fetchForecast ~ errorText:", errorText)
                throw new Error("Failed to fetch forecast data")
            };
            const forecast: Forecast[] = await res.json();
            setForecast(forecast);
        } catch (err) {
            setError("Error fetching forecast data: " + (err instanceof Error ? err.message : "Unknown error"));
            setForecast([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileParse = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: (header) => header !== "Timestamp",
            complete: (result) => {
                if (result.errors.length) {
                    setError("Error parsing CSV file.");
                    return;
                }

                // Validate columns before proceeding
                if (!validateColumns(result.meta.fields || [])) {
                    return;
                }

                const data: DataPoint[] = result.data as DataPoint[];
                
                // Validate row count before proceeding
                if (!validateRowCount(data)) {
                    return;
                }

                setDataPoints(data);
                fetchClassifications(data);
                fetchForecast(data);
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
                <CSVUploader />
            </div>
            {isLoading && (
                <p className="text-blue-500 mt-2 animate-pulse">Processing file... Please wait.</p>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}