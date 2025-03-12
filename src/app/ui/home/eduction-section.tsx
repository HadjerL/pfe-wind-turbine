import { MdInsights } from "react-icons/md";
import { FaFileCsv } from "react-icons/fa6";
import { MdOutlineReportProblem } from "react-icons/md";
import { FaChartPie } from "react-icons/fa";
import { PiChartScatterBold } from "react-icons/pi";
import { MdBatchPrediction } from "react-icons/md";

export default function EducationSection() {
    const steps = [
        {
            title: "1. Upload SCADA Data",
            desc: "Upload a CSV file containing wind turbine SCADA data.",
            Icon: FaFileCsv
        },
        {
            title: "2. Get Data Insights",
            desc: "View key statistics like start/end date, duration, and averages.",
            Icon: MdInsights
        },
        {
            title: "3. Anomaly Detection",
            desc: "See a pie chart of normal vs. anomaly data points.",
            Icon: MdOutlineReportProblem
        },
        {
            title: "4. Anomaly Breakdown",
            desc: "Analyze the percentage of each anomaly type in your data.",
            Icon: FaChartPie
        },
        {
            title: "5. Detailed Anomaly Scatter Plot",
            desc: "View timestamped anomalies in a scatter plot for deeper analysis.",
            Icon: PiChartScatterBold
        },
        {
            title: "6. Forecast & Export",
            desc: "Forecast wind energy output and export any chart as an image.",
            Icon: MdBatchPrediction
        }
    ];

    return (
        <section id="education" className="py-16 px-24 bg-gray-50">
            <h2 className="text-3xl font-bold text-center text-primary">How It Works</h2>
            <div className="grid grid-cols-3 gap-8 mt-12">
                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-6 border rounded-lg bg-white shadow-md">
                        <step.Icon className="text-4xl text-primary" />
                        <h3 className="text-xl font-semibold mt-4">{step.title}</h3>
                        <p className="text-gray-600">{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
