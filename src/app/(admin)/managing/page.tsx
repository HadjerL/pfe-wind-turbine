import Link from "next/link";
import { FaRobot, FaChartLine, FaDatabase, FaCogs } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";

export default function ModelManagementDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="p-4 bg-white rounded-full shadow-lg mb-4">
            <GiArtificialIntelligence className="text-4xl text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Model Management</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Central hub for managing your classification and forecasting models
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Classification Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <Link 
              href="/managing/classification"
              className="relative bg-white p-8 rounded-xl shadow-lg flex flex-col h-full border border-gray-200 hover:border-blue-400 transition-colors"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <FaRobot className="text-blue-600 text-2xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Classification Models</h2>
              </div>
              <p className="text-gray-600 mb-6 flex-grow">
                Manage and evaluate classification models with multiple evaluation methods including multi-label, 
                class-pair, and normal-abnormal analysis.
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-blue-600 font-medium flex items-center">
                  <span>Manage Models</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {['Multi-label', 'Class Pair', 'Single Class', 'Normal-Abnormal'].join(' • ')}
                </span>
              </div>
            </Link>
          </div>

          {/* Forecasting Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <Link 
              href="/managing/forecasting"
              className="relative bg-white p-8 rounded-xl shadow-lg flex flex-col h-full border border-gray-200 hover:border-green-400 transition-colors"
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <FaChartLine className="text-green-600 text-2xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Forecasting Models</h2>
              </div>
              <p className="text-gray-600 mb-6 flex-grow">
                Analyze time-series forecasting models with comprehensive visualizations including 
                model comparisons, horizon metrics, and time-series predictions.
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-green-600 font-medium flex items-center">
                  <span>Manage Models</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  MAE • MSE • RMSE • R²
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/managing/classification/datatables"
              className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center mb-3">
                <FaDatabase className="text-blue-500 mr-2" />
                <h3 className="font-medium">Classification Reports</h3>
              </div>
              <p className="text-sm text-gray-600">
                View detailed classification reports and performance metrics
              </p>
            </Link>
            <Link 
              href="/managing/classification"
              className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center mb-3">
                <FaCogs className="text-blue-500 mr-2" />
                <h3 className="font-medium">Model Configuration</h3>
              </div>
              <p className="text-sm text-gray-600">
                Configure classification models and evaluation parameters
              </p>
            </Link>
            <Link 
              href="/managing/forecasting"
              className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center mb-3">
                <FaChartLine className="text-blue-500 mr-2" />
                <h3 className="font-medium">Forecast Analysis</h3>
              </div>
              <p className="text-sm text-gray-600">
                Analyze forecasting model performance and predictions
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}