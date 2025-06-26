'use client';

import { ModelHyperparameters } from '@/app/lib/definitions';

export default function HyperparametersDisplay({ results }: { results: ModelHyperparameters }) {
  if (!results) return null;

  // Enhanced helper function to safely display any value
  const displayValue = (value: unknown): string => {
    if (value === undefined || value === null) return 'N/A';
    if (typeof value === 'number') {
      if (isNaN(value)) return 'N/A';
      // Format numbers nicely - integers as-is, floats with 4 decimal places max
      return Number.isInteger(value) ? value.toString() : value.toFixed(4).replace(/\.?0+$/, '');
    }
    return String(value);
  };

  // Use results directly as the hyperparameters object
  const hyperparams = results;
  const modelType: string = typeof hyperparams.model_type === 'string' ? hyperparams.model_type : 'N/A';

  return (
    <div className="mt-6 p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Model Hyperparameters</h3>
      
      <div className="border p-4 rounded-lg bg-gray-50">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-medium text-gray-700 capitalize">
            {modelType} Model Configuration
          </h4>
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            {modelType}
          </span>
        </div>
        
        <div className="space-y-3">
          {/* Architecture Info */}
          <div>
            <h5 className="text-sm font-medium text-gray-500 mb-1">Architecture</h5>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium">{modelType}</span>
              </div>
            </div>
          </div>

          {/* Training Configuration */}
          <div>
            <h5 className="text-sm font-medium text-gray-500 mb-1">Training Configuration</h5>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Batch Size:</span>
                <span className="ml-2 font-medium">{displayValue(hyperparams.batch_size)}</span>
              </div>
              <div>
                <span className="text-gray-600">Optimizer:</span>
                <span className="ml-2 font-medium capitalize">{displayValue(hyperparams.optimizer)}</span>
              </div>
              <div>
                <span className="text-gray-600">Learning Rate:</span>
                <span className="ml-2 font-medium">{displayValue(hyperparams.learning_rate)}</span>
              </div>
            </div>
          </div>

          {/* CNN Specific Parameters */}
          {modelType === 'CNN' && (
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-1">CNN Architecture</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Conv Layers:</span>
                  <span className="ml-2 font-medium">{displayValue(hyperparams.num_conv_layers)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Conv Filters:</span>
                  <span className="ml-2 font-medium">{displayValue(hyperparams.conv1_filters)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Dense Layers:</span>
                  <span className="ml-2 font-medium">{displayValue(hyperparams.num_dense_layers)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Dense Units:</span>
                  <span className="ml-2 font-medium">{displayValue(hyperparams.dense1_units)}</span>
                </div>
              </div>
            </div>
          )}

          {/* LSTM Specific Parameters */}
          {modelType === 'LSTM' && (
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-1">LSTM Architecture</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">LSTM Layers:</span>
                  <span className="ml-2 font-medium">{displayValue(hyperparams.num_lstm_layers)}</span>
                </div>
                <div>
                  <span className="text-gray-600">LSTM Units:</span>
                  <span className="ml-2 font-medium">{displayValue(hyperparams.lstm_units)}</span>
                </div>
              </div>
            </div>
          )}

          {/* RNN Specific Parameters */}
          {modelType === 'RNN' && (
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-1">RNN Architecture</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">RNN Layers:</span>
                  <span className="ml-2 font-medium">{displayValue(hyperparams.num_rnn_layers)}</span>
                </div>
                <div>
                  <span className="text-gray-600">RNN Units:</span>
                  <span className="ml-2 font-medium">{displayValue(hyperparams.rnn_units)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}