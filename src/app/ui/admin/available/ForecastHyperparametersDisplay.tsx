'use client';

import { ForecastHyperparameters } from '@/app/lib/definitions';

export default function ForecastHyperparametersDisplay({ 
  results 
}: { 
  results: { hyperparameters: ForecastHyperparameters } 
}) {
  if (!results.hyperparameters) return null;

  const displayValue = (value: unknown): string => {
    if (value === undefined || value === null) return 'N/A';
    if (typeof value === 'number') {
      if (isNaN(value)) return 'N/A';
      return Number.isInteger(value) ? value.toString() : value.toFixed(4).replace(/\.?0+$/, '');
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  };

  const hyperparams = results.hyperparameters;
  const modelType = hyperparams.model_type || 'LSTM';

  return (
    <div className="mt-3 p-4 border rounded-lg shadow-sm bg-gray-50">
      <h3 className="text-md font-semibold mb-3 text-gray-700">Model Hyperparameters</h3>
      
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

        {/* LSTM Specific Parameters */}
        <div>
          <h5 className="text-sm font-medium text-gray-500 mb-1">LSTM Architecture</h5>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Layers:</span>
              <span className="ml-2 font-medium">{displayValue(hyperparams.num_layers)}</span>
            </div>
            <div>
              <span className="text-gray-600">Units:</span>
              <span className="ml-2 font-medium">{displayValue(hyperparams.units)}</span>
            </div>
            <div>
              <span className="text-gray-600">Activation:</span>
              <span className="ml-2 font-medium capitalize">{displayValue(hyperparams.activation)}</span>
            </div>
            {hyperparams.use_dropout && (
              <div>
                <span className="text-gray-600">Dropout Rate:</span>
                <span className="ml-2 font-medium">{displayValue(hyperparams.dropout_rate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}