'use client'
import { useState } from "react";
import { useDataStore } from "@/app/lib/dataStore";
import Papa from 'papaparse';
import { MdSaveAlt } from "react-icons/md";

export default function CSVUploader(){
    const classifications = useDataStore((state) => state.classifications); 
    const data = useDataStore((state) => state.data); 
    const [error, setError] = useState<string | null>(null);

    const downloadCSV = () => {
        if (!data || data.length === 0) {
            setError("No data available yet.");
            return;
        }

        if (!classifications || classifications.length === 0) {
            setError("No classification data available to download.");
            return;
        }

        const combinedData = data.map((elem, i) => ({
            ...elem,
            classification: classifications[i].Predicted_Classes,
        }));

        const csvData = Papa.unparse(combinedData);

        const blob = new Blob([csvData], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "classification_results.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    };

    return(
        <>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {classifications && classifications.length > 0 && (
                <button
                    onClick={downloadCSV}
                    className="
                    flex flex-row items-center rounded bg-primary text-white 
                    px-10 border hover:bg-slate-200 hover:text-text py-2 justify-center
                    "
                >
                    <MdSaveAlt className="text-lg"/>.csv
                </button>
            )}
        </>
    )
}