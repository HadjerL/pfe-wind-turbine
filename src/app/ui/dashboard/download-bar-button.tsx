// app/ui/admin/download-bar-button.tsx
'use client';

import { FaSave } from "react-icons/fa";
import { Chart as ChartJS } from 'chart.js';
import { RefObject } from 'react';

export default function DownloadBarButton(props: {
    chartRef: RefObject<ChartJS<'bar'> | null>;
    filename: string;
}) {
    const downloadChart = () => {
        if (!props.chartRef) {
            alert("Chart reference is not available.");
            return;
        }

        const canvas = props.chartRef.current?.canvas;
        if (!canvas) {
            alert("Canvas not found.");
            return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            alert("Failed to get canvas context.");
            return;
        }

        try {
            // Save the current state
            ctx.save();

            // Set white background
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Convert to image
            const image = canvas.toDataURL("image/png");

            // Restore original state
            ctx.restore();

            // Create a download link
            const link = document.createElement("a");
            link.href = image;
            link.download = `${props.filename}.png`;
            link.click();
        } catch (error) {
            const errorMessage = (error as Error).message;
            alert("An error occurred while downloading the chart: " + errorMessage);
        }
    };

    return (
        <button 
            onClick={downloadChart} 
            className="relative group p-2 rounded-md hover:bg-gray-200 transition"
        >
            <FaSave className="text-xl" />
            {/* Tooltip */}
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 bg-black text-white text-xs rounded-md px-2 py-1 transition">
                Save as image
            </span>
        </button>
    );
}