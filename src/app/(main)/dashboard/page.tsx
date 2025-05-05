import Link from "next/link";

export default function Page() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
            AI-Powered Predictive Maintenance for Wind Turbines
            </h1>
            <p className="text-lg text-gray-600">
            Leverage SCADA data and AI-driven insights to detect faults early, 
            predict energy output, and optimize maintenance for wind farms.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {/* CSV Option */}
            <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <Link 
                href="/dashboard/csvSystem"
                className="relative bg-white p-8 rounded-xl shadow-lg flex flex-col h-full border border-gray-200 hover:border-blue-400 transition-colors"
            >
                <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Historical Data Analysis</h2>
                </div>
                <p className="text-gray-600 mb-6 flex-grow">
                Upload SCADA data in CSV format to get comprehensive AI analysis of past turbine performance, 
                including anomaly detection and power output forecasts.
                </p>
                <div className="text-sm text-blue-600 font-medium flex items-center">
                <span>Analyze existing data</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                </div>
            </Link>
            </div>

            {/* Real-time Option */}
            <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <Link 
                href="/dashboard/realTimeSystem"
                className="relative bg-white p-8 rounded-xl shadow-lg flex flex-col h-full border border-gray-200 hover:border-green-400 transition-colors"
            >
                <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Live Monitoring</h2>
                </div>
                <p className="text-gray-600 mb-6 flex-grow">
                Connect directly to your SCADA system for real-time AI analysis, 
                receiving immediate anomaly alerts and continuous performance predictions.
                </p>
                <div className="text-sm text-green-600 font-medium flex items-center">
                <span>Monitor active turbines</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                </div>
            </Link>
            </div>
        </div>

        <div className="mt-12 text-center max-w-2xl">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Not sure what to choose?</h3>
            <p className="text-gray-500">
            choose historical analysis for existing data 
            or live monitoring for real-time insights.
            </p>
        </div>
        </div>
    );
}