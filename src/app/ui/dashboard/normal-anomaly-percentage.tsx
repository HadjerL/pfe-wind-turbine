'use client';
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import 'chart.js/auto';
import { useDataStore } from "@/app/lib/dataStore";
import DownloadPieButton from "./download-pie-button";
import { Chart as ChartJS } from 'chart.js';

const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), {
    ssr: false,
});

export default function AnomalyNormalPercentageCard() {
    const classifications = useDataStore((state) => state.classifications);
    const [percentages, setPercentages] = useState<{ normal: number; anomaly: number }>({ normal: 0, anomaly: 0 });
    const chartRef = useRef<ChartJS<'pie'> | null>(null);

    useEffect(() => {
        if (!classifications || classifications.length === 0) return;

        let normalCount = 0;
        let anomalyCount = 0;

        classifications.forEach((item) => {
            if (item.Predicted_Classes.includes("Normal")) {
                normalCount++;
            } else {
                anomalyCount++;
            }
        });

        const total = normalCount + anomalyCount || 1;
        setPercentages({
            normal: (normalCount / total) * 100,
            anomaly: (anomalyCount / total) * 100,
        });
    }, [classifications]);

    if (!classifications || classifications.length === 0) {
        return (
            <div className="shadow-md rounded-lg">
                <div className="bg-slate-100 p-4 flex flex-row justify-between">
                    <h1 className="text-sm font-bold text-center">Normal vs Anomaly Percentage</h1>
                </div>
                <div className="flex items-center justify-center">
                    <div className="animate-pulse w-60 h-60 bg-gray-300 rounded-full"></div>
                </div>
                <div className="p-4 space-y-4">
                    <p className="text-center text-lg font-semibold text-gray-400">Processing data...</p>
                </div>
            </div>
        )
    }

    const chartData = {
        labels: ["Normal", "Anomaly"],
        datasets: [
            {
                label: "Distribution",
                data: [percentages.normal, percentages.anomaly],
                backgroundColor: ["#36A2EB", "#FF6384"],
                hoverBackgroundColor: ["#36A2EBB3", "#FF6384B3"],
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

    const plotTitle = "Normal vs Anomaly Percentage";

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
