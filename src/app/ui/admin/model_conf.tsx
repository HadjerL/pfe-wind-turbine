'use client';

import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

interface HyperparameterConfig {
  modelType: 'CNN' | 'LSTM' | 'RNN';
  maxTrials: number;
  executionsPerTrial: number;
  epochs: number;
  patience: number;
  batchSizes: number[];
  optimizers: string[];
  learningRates: number[];
  convFilters: number[];
  denseUnits: number[];
  lstmUnits: number[];
  rnnUnits: number[];
}

export function ModelConfigForm({ onSubmit }: { onSubmit: (config: HyperparameterConfig) => void }) {
  const [config, setConfig] = useState<HyperparameterConfig>({
    modelType: 'CNN',
    maxTrials: 30,
    executionsPerTrial: 1,
    epochs: 100,
    patience: 10,
    batchSizes: [16, 32, 64],
    optimizers: ['adam', 'sgd'],
    learningRates: [0.001, 0.01],
    convFilters: [64, 128, 256, 512, 1024],
    denseUnits: [64, 128, 256, 512, 1024],
    lstmUnits: [64, 128, 256, 512, 1024],
    rnnUnits: [64, 128, 256, 512, 1024]
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
  };

  const addNumberOption = (field: keyof HyperparameterConfig, value: number) => {
    setConfig(prev => {
      const arr = prev[field];
      if (Array.isArray(arr)) {
        return {
          ...prev,
          [field]: [...arr, value]
        };
      }
      return prev;
    });
  };

  const removeNumberOption = (field: keyof HyperparameterConfig, index: number) => {
    setConfig(prev => {
      const arr = prev[field];
      if (Array.isArray(arr)) {
        return {
          ...prev,
          [field]: arr.filter((_, i) => i !== index)
        };
      }
      return prev;
    });
  };
  
  const addStringOption = (field: keyof HyperparameterConfig, value: string) => {
    setConfig(prev => {
      const arr = prev[field];
      if (Array.isArray(arr)) {
        return {
          ...prev,
          [field]: [...arr, value]
        };
      }
      return prev;
    });
  };

  const removeStringOption = (field: keyof HyperparameterConfig, index: number) => {
    setConfig(prev => {
      const arr = prev[field];
      if (Array.isArray(arr)) {
        return {
          ...prev,
          [field]: arr.filter((_, i) => i !== index)
        };
      }
      return prev;
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof HyperparameterConfig) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setConfig(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleArrayNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    field: keyof HyperparameterConfig, 
    index: number
  ) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setConfig(prev => {
        const arr = Array.isArray(prev[field]) ? [...(prev[field] as number[])] : [];
        arr[index] = value;
        return { ...prev, [field]: arr };
      });
    }
  };

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="text-lg font-bold mb-4 text-primary">New Model Configuration</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Basic Configuration */}
          <div>
            <label className="block mb-2 font-medium">Model Type</label>
            <select
              value={config.modelType}
              onChange={(e) => setConfig({...config, modelType: e.target.value as 'CNN' | 'LSTM' | 'RNN'})}
              className="w-full p-2 border rounded"
            >
              <option value="CNN">CNN</option>
              <option value="LSTM">LSTM</option>
              <option value="RNN">RNN</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Max Trials</label>
            <input
              type="number"
              min="1"
              max="100"
              value={config.maxTrials}
              onChange={(e) => handleNumberChange(e, 'maxTrials')}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Executions Per Trial</label>
            <input
              type="number"
              min="1"
              max="5"
              value={config.executionsPerTrial}
              onChange={(e) => handleNumberChange(e, 'executionsPerTrial')}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Epochs</label>
            <input
              type="number"
              min="1"
              max="500"
              value={config.epochs}
              onChange={(e) => handleNumberChange(e, 'epochs')}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Early Stopping Patience</label>
            <input
              type="number"
              min="1"
              max="20"
              value={config.patience}
              onChange={(e) => handleNumberChange(e, 'patience')}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Advanced Configuration Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-primary mb-4 flex items-center gap-2"
        >
          {showAdvanced ? <FaMinus /> : <FaPlus />}
          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </button>

        {/* Advanced Configuration */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Batch Sizes */}
            <div>
              <label className="block mb-2 font-medium">Batch Sizes</label>
              <div className="space-y-2">
                {config.batchSizes.map((size, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={size}
                      onChange={(e) => handleArrayNumberChange(e, 'batchSizes', index)}
                      className="p-2 border rounded flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeNumberOption('batchSizes', index)}
                      className="text-red-500 p-2"
                    >
                      <FaMinus />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addNumberOption('batchSizes', 32)}
                  className="text-primary flex items-center gap-1 text-sm"
                >
                  <FaPlus /> Add Batch Size
                </button>
              </div>
            </div>

            {/* Optimizers */}
            <div>
              <label className="block mb-2 font-medium">Optimizers</label>
              <div className="space-y-2">
                {config.optimizers.map((opt, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <select
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...config.optimizers];
                        newOpts[index] = e.target.value;
                        setConfig({...config, optimizers: newOpts});
                      }}
                      className="p-2 border rounded flex-1"
                    >
                      <option value="adam">Adam</option>
                      <option value="sgd">SGD</option>
                      <option value="rmsprop">RMSprop</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeStringOption('optimizers', index)}
                      className="text-red-500 p-2"
                    >
                      <FaMinus />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addStringOption('optimizers', 'adam')}
                  className="text-primary flex items-center gap-1 text-sm"
                >
                  <FaPlus /> Add Optimizer
                </button>
              </div>
            </div>

            {/* Learning Rates */}
            <div>
              <label className="block mb-2 font-medium">Learning Rates</label>
              <div className="space-y-2">
                {config.learningRates.map((lr, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.001"
                      // min="0.0001"
                      value={lr}
                      onChange={(e) => handleArrayNumberChange(e, 'learningRates', index)}
                      className="p-2 border rounded flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeNumberOption('learningRates', index)}
                      className="text-red-500 p-2"
                    >
                      <FaMinus />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addNumberOption('learningRates', 0.001)}
                  className="text-primary flex items-center gap-1 text-sm"
                >
                  <FaPlus /> Add Learning Rate
                </button>
              </div>
            </div>

            {/* Model-specific parameters */}
            {config.modelType === 'CNN' && (
              <>
                <div>
                  <label className="block mb-2 font-medium">Conv Filters</label>
                  <div className="space-y-2">
                    {config.convFilters.map((filters, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="number"
                          min="16"
                          step="16"
                          value={filters}
                          onChange={(e) => handleArrayNumberChange(e, 'convFilters', index)}
                          className="p-2 border rounded flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removeNumberOption('convFilters', index)}
                          className="text-red-500 p-2"
                        >
                          <FaMinus />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addNumberOption('convFilters', 64)}
                      className="text-primary flex items-center gap-1 text-sm"
                    >
                      <FaPlus /> Add Filter Size
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Dense Units</label>
                  <div className="space-y-2">
                    {config.denseUnits.map((units, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="number"
                          min="16"
                          step="16"
                          value={units}
                          onChange={(e) => handleArrayNumberChange(e, 'denseUnits', index)}
                          className="p-2 border rounded flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removeNumberOption('denseUnits', index)}
                          className="text-red-500 p-2"
                        >
                          <FaMinus />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addNumberOption('denseUnits', 64)}
                      className="text-primary flex items-center gap-1 text-sm"
                    >
                      <FaPlus /> Add Dense Units
                    </button>
                  </div>
                </div>
              </>
            )}

            {config.modelType === 'LSTM' && (
              <div>
                <label className="block mb-2 font-medium">LSTM Units</label>
                <div className="space-y-2">
                  {config.lstmUnits.map((units, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="number"
                        min="16"
                        step="16"
                        value={units}
                        onChange={(e) => handleArrayNumberChange(e, 'lstmUnits', index)}
                        className="p-2 border rounded flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeNumberOption('lstmUnits', index)}
                        className="text-red-500 p-2"
                      >
                        <FaMinus />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addNumberOption('lstmUnits', 64)}
                    className="text-primary flex items-center gap-1 text-sm"
                  >
                    <FaPlus /> Add LSTM Units
                  </button>
                </div>
              </div>
            )}

            {config.modelType === 'RNN' && (
              <div>
                <label className="block mb-2 font-medium">RNN Units</label>
                <div className="space-y-2">
                  {config.rnnUnits.map((units, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="number"
                        min="16"
                        step="16"
                        value={units}
                        onChange={(e) => handleArrayNumberChange(e, 'rnnUnits', index)}
                        className="p-2 border rounded flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeNumberOption('rnnUnits', index)}
                        className="text-red-500 p-2"
                      >
                        <FaMinus />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addNumberOption('rnnUnits', 64)}
                    className="text-primary flex items-center gap-1 text-sm"
                  >
                    <FaPlus /> Add RNN Units
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Start Model Training
        </button>
      </form>
    </div>
  );
}