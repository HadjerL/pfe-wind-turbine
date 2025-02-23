'use client';
import dynamic from "next/dynamic";
import 'chart.js/auto';
import { useState, useRef } from "react";
import { useDataStore } from "@/app/lib/dataStore"; 
import { variables } from "@/app/lib/placeholder-data";
import type { DataPoint } from "@/app/lib/definitions";
import DownloadLineButton from "./download-line-button";
import { Chart as ChartJS } from 'chart.js';

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
    ssr: false,
});

export default function VarCard() {
    const data = useDataStore((state) => state.data); 
    const [selectedVar, setSelectedVar] = useState<string>(variables[0]?.name || "");
    const [selectedVarKey, setSelectedVarKey] = useState<keyof DataPoint>(variables[0]?.key as keyof DataPoint);
    const chartRef = useRef<ChartJS<'line'> | null>(null);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const [name, key] = event.target.value.split(',');
        setSelectedVar(name);
        setSelectedVarKey(key as keyof DataPoint);
    };

    if (!data || data.length === 0) {
        return <p className="p-4 text-red-500">No data available. Please upload a CSV file first.</p>;
    }

    const labels = data.map((entry) => entry.Timestamp);
    const values =
        selectedVarKey === ("Wind_Direction" as keyof DataPoint)
            ? data.map((entry) =>
                  Math.atan2(entry["Wind_Direction_Sin"], entry["Wind_Direction_Cos"]) * (180 / Math.PI)
            )
            : data.map((entry) => entry[selectedVarKey]);

    const points = {
        labels: labels,
        datasets: [
            {
                label: selectedVar,
                data: values,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                title: { display: true, text: 'Timestamp' },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    callback: function (tickValue: string | number, index: number) {
                        return index % 2 === 0 ? labels[index] : '';
                    },
                },
            },
            y: {
                title: { display: true, text: selectedVar },
            }
        },
    };

    return (
        <div className="shadow-md rounded-lg">
            <div className="bg-slate-100 py-4 p-8 flex flex-row justify-between">
                <h1 className=" text-sm font-bold">Health Indicator Over Time</h1>
                <DownloadLineButton chartRef={chartRef} filename={`${selectedVar} plot.png`}/>
            </div>
            <div className="flex justify-end">
                <select
                    name="selected-variable p-2"
                    className="p-2 text-sm"
                    onChange={handleSelectChange}
                    value={[selectedVar, selectedVarKey].join(',')}
                >
                    {variables.map((variable) => (
                        <option key={variable.key} id={variable.key} value={[variable.name, variable.key].join(',')}>
                            {variable.name}
                        </option>
                    ))}
                </select>
            </div>
            <Line ref={chartRef} className="p-8" data={points} options={options} />
        </div>
    );
}
