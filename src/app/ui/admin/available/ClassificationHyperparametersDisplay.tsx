'use client';

import { ModelHyperparameters } from '@/app/lib/definitions';

export default function ClassificationHyperparametersDisplay({ 
  results 
}: { 
  results: { hyperparameters: ModelHyperparameters } 
}) {
  if (!results.hyperparameters) return null;

  const displayValue = (value: unknown): string => {
    if (value === undefined || value === null) return 'N/A';
    if (typeof value === 'number') {
      if (isNaN(value)) return 'N/A';
      return Number.isInteger(value) ? value.toString() : value.toFixed(4).replace(/\.?0+$/, '');
    }
    return String(value);
  };

  const hyperparams = results.hyperparameters;
  const modelType = hyperparams.model_type || 'N/A';

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
  );
}