'use client';
import dynamic from "next/dynamic";
import { useState, useEffect, useMemo, useRef } from "react";
import 'chart.js/auto';
import { useDataStore } from "@/app/lib/dataStore";
import DownloadPieButton from "./download-pie-button";
import { Chart as ChartJS } from 'chart.js';

const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), {
    ssr: false,
});

export default function AnomalyPercentageCard() {
    const classifications = useDataStore((state) => state.classifications); // Get classification data from store
    const [classCounts, setClassCounts] = useState<{ [key: string]: number }>({});
    const chartRef = useRef<ChartJS<'pie'> | null>(null);

    const uniqueClasses = useMemo(() => [
        'Communication', 'Electrical system', 'Gearbox',
        'Hydraulic system', 'Pitch system', 'Yaw system', 'Other'
    ], []);

    const colors = useMemo(() => [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF"
    ], []);

    useEffect(() => {
        if (!classifications || classifications.length === 0) {
            return;
        }

        const counts: { [key: string]: number } = {};

        classifications.forEach((item) => {
            item.Predicted_Classes.forEach((predictedClass) => {
                counts[predictedClass] = (counts[predictedClass] || 0) + 1;
            });
        });

        setClassCounts(counts);
    }, [classifications]); // Update when classifications change

    if (!classifications || classifications.length === 0) {
        return (
            <div className="shadow-md rounded-lg">
                <div className="bg-slate-100 p-4 flex flex-row justify-between">
                    <h1 className="text-sm font-bold text-center">Anomaly Percentage Distribution</h1>
                </div>
                <div className="flex items-center justify-center">
                    {/* Skeleton loader */}
                    <div className="animate-pulse w-60 h-60 bg-gray-300 rounded-full"></div>
                </div>
                <div className="p-4 space-y-4">
                    <p className="text-center text-lg font-semibold text-gray-400">Processing data...</p>
                </div>
            </div>
        )
    }

    const total = Object.values(classCounts).reduce((sum, count) => sum + count, 0) || 1;
    const percentages = uniqueClasses.map((cls) => ((classCounts[cls] || 0) / total) * 100);

    const chartData = {
        labels: uniqueClasses,
        datasets: [
            {
                label: "Anomaly Percentage",
                data: percentages,
                backgroundColor: colors,
                hoverBackgroundColor: colors.map(color => color + "B3"),
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "right" as const,
                labels: {
                    usePointStyle: true,
                    pointStyle: "rect",
                    padding: 15,
                },
            },
        },
    };

    const plotTitle = "Anomaly Percentage Distribution";

    return (
        <div className="shadow-md rounded-lg">
            <div className="bg-slate-100 p-4 flex flex-row justify-between">
                <h1 className="text-sm font-bold text-center">{plotTitle}</h1>
                <DownloadPieButton chartRef={chartRef} filename={`${plotTitle} plot.png`} />
            </div>
            <div className="flex items-center justify-center">
                <div className="w-60 h-60">
                    <Pie ref={chartRef} data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
}
