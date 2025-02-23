'use client';
import dynamic from "next/dynamic";
import { useState, useEffect, useMemo, useRef } from "react";
import 'chart.js/auto';
import { useDataStore } from "@/app/lib/dataStore";
import { Chart as ChartJS } from 'chart.js';
import DownloadButton from "@/app/ui/dashboard/download-scatter-button";

const Scatter = dynamic(() => import('react-chartjs-2').then((mod) => mod.Scatter), {
    ssr: false,
});

export default function ScatterPlot() {
    const data = useDataStore((state) => state.data);
    const classification = useDataStore((state) => state.classifications);
    const [scatterData, setScatterData] = useState<{ x: string; y: number }[]>([]);
    const chartRef = useRef<ChartJS<'scatter'> | null>(null);
    
    const uniqueClasses = useMemo(() => [
        'Normal', 'Communication', 'Electrical system', 'Gearbox',
        'Hydraulic system', 'Pitch system', 'Yaw system', 'Other'
    ], []);

    useEffect(() => {
        if (!data || data.length === 0 || !classification || classification.length === 0) return;

        const classMapping: { [key: string]: number } = {
            "Normal": 0,
            "Communication": 1, 
            "Electrical system": 2, 
            "Gearbox": 3, 
            "Hydraulic system": 4, 
            "Pitch system": 5, 
            "Yaw system": 6, 
            "Other": 7
        };

        const formattedData: { x: string; y: number }[] = [];
        classification.forEach((item, index) => {
            item.Predicted_Classes.forEach((predictedClass) => {
                formattedData.push({
                    x: data[index]?.Timestamp || "Unknown",
                    y: classMapping[predictedClass]
                });
            });
        });

        setScatterData(formattedData);
    }, [data, classification]);

    if (!classification || classification.length === 0) {
        return <p className="p-4 text-red-500">No classification data available. Please upload a CSV file first.</p>;
    }

    const labels = data.map((point) => point.Timestamp);
    const chartData = {
        labels: labels, 
        datasets: [
            {
                label: "State",
                data: scatterData,
                backgroundColor: 'rgb(75, 192, 192)',
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                type: 'category' as const,
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
                title: { display: true, text: "Class" },
                ticks: {
                    stepSize: 1,
                    callback: function (tickValue: string | number) {
                        const value = Number(tickValue);
                        return uniqueClasses[value] || value;
                    }
                }
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: "black"
                }
            }
        }
    };

    const plotTitle = "Turbine State Over Time";

    return (
        <div className="shadow-md rounded-lg">
            <div className="bg-slate-100 py-4 px-10 flex flex-row justify-between items-center">
                <h1 className="text-sm font-bold">{plotTitle}</h1>
                <DownloadButton chartRef={chartRef} filename={`${plotTitle} plot.png`} />
            </div>
            <Scatter ref={chartRef} className="p-8" data={chartData} options={options} />
        </div>
    );
}
