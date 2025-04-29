'use client'
import { useState } from "react";
import Papa from 'papaparse'
import { useDataStore } from "@/app/lib/dataStore";
import { DataPoint, Classification } from "@/app/lib/definitions";
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

export default function Uploader() {
    const data = useDataStore((state) => state.data);
    console.log("🚀 ~ Uploader ~ data:", data)
    const classification = useDataStore((state) => state.classifications);
    console.log("🚀 ~ Uploader ~ classification:", classification)
    const setDataPoints = useDataStore((state) => state.setData);
    const setClassifications = useDataStore((state) => state.setClassifications);
    
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateColumns = (headers: string[]): boolean => {
        const missingColumns = REQUIRED_COLUMNS.filter(
            column => !headers.includes(column)
        );
        
        if (missingColumns.length > 0) {
            setError(`Missing required columns: ${missingColumns.join(', ')}`);
            setDataPoints([])
            setClassifications([])
            return false;
        }
        
        return true;
    };

    const fetchClassifications = async (data: DataPoint[]) => {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            const response = await fetch("http://192.168.228.118:5000/predict", {
                // const response = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Failed to fetch classifications");

            const classificationResult: Classification[] = await response.json();
            setClassifications(classificationResult);
        } catch (err) {
            setError("Error fetching classification data: " + (err instanceof Error ? err.message : "Unknown error"));
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
                setDataPoints(data);
                fetchClassifications(data);
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