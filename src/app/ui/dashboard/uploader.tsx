'use client'
import { useState } from "react";
import Papa from 'papaparse'
import { useDataStore } from "@/app/lib/dataStore";
import { DataPoint, Classification } from "@/app/lib/definitions";
import CSVUploader from "./csv-uploader";

export default function Uploader() {
    const setDataPoints = useDataStore((state) => state.setData);
    const setClassifications = useDataStore((state) => state.setClassifications);

    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: (header) => header !== "Timestamp",
            complete: async (result) => {
                if (result.errors.length) {
                    setError("Error parsing CSV file.");
                    return;
                }

                const data: DataPoint[] = result.data as DataPoint[];
                setDataPoints(data); 

                try {
                    const response = await fetch("http://127.0.0.1:5000/predict", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    });

                    if (!response.ok) throw new Error("Failed to fetch classifications");

                    const classificationResult: Classification[] = await response.json();
                    setClassifications(classificationResult);

                } catch (err) {
                    setError("Error fetching classification data: " + (err instanceof Error ? err.message : "Unknown error"));
                }
            },
            error: (err) => setError(`Parsing error: ${err.message}`),
        });
    };
    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-lg font-bold mb-2 text-primary">Upload CSV File</h2>
            <div className="flex flex-row gap-5">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="border p-2 rounded bg-slate-100"
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <CSVUploader/>
            </div>
        </div>
    );
}
