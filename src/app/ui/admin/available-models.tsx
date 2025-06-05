'use client';

import { useEffect, useState, useCallback } from 'react';
import { FaRobot, FaSyncAlt, FaHistory, FaTrash } from 'react-icons/fa';
import { GiWindTurbine } from 'react-icons/gi';
import { toast } from 'react-toastify';

type ModelInfo = {
  model_name: string;
  is_current: boolean;
  is_tuned?: boolean;
  is_old?: boolean;
  can_delete?: boolean;
};

type ModelsResponse = {
  classification_models?: ModelInfo[];
  forecasting_models?: ModelInfo[];
  current_model: string;
  has_old_model?: boolean;
};

export default function ModelInfo({
  models_type
}: {
  models_type: 'classification' | 'forecasting';
}) {
  const [models, setModels] = useState<ModelsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOldModels, setShowOldModels] = useState(false);

  const fetchModels = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const endpoint = models_type === 'classification' 
        ? '/api/available_classification_models' 
        : '/api/available_forecasting_models';
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load model information');
      }

      // Mark models that can be deleted (not current and not only backup)
      const processedData = {
        ...data,
        [models_type === 'classification' ? 'classification_models' : 'forecasting_models']: 
          data[models_type === 'classification' ? 'classification_models' : 'forecasting_models'].map((model: ModelInfo) => ({
            ...model,
            can_delete: !model.is_current && !(model.is_old && data.has_old_model && data.has_old_model > 1)
          }))
      };

      setModels(processedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load model information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [models_type]);

  const setActiveModel = async (modelName: string) => {
    try {
      const endpoint = models_type === 'classification'
        ? '/api/set_active_classification_model'
        : '/api/set_active_forecasting_model';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_name: modelName })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success(`Model ${modelName} set as active`);
      fetchModels(); // Refresh the list
    } catch (err) {
      toast.error(`Failed to set active model: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const restoreOldModel = async () => {
    try {
      const endpoint = models_type === 'classification'
        ? '/api/restore_old_classification_model'
        : '/api/restore_old_forecasting_model';
      
      const response = await fetch(endpoint, { method: 'POST' });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success('Old model restored');
      fetchModels(); // Refresh the list
    } catch (err) {
      toast.error(`Failed to restore old model: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const deleteModel = async (modelName: string) => {
    if (!confirm(`Are you sure you want to delete ${modelName}? This cannot be undone.`)) {
      return;
    }

    try {
      const endpoint = models_type === 'classification'
        ? '/api/delete_classification_model'
        : '/api/delete_forecasting_model';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_name: modelName })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success(`Model ${modelName} deleted`);
      fetchModels(); // Refresh the list
    } catch (err) {
      toast.error(`Failed to delete model: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-8">
      <svg className="animate-spin h-8 w-8 text-primary mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span className="text-primary font-medium">Loading model information...</span>
    </div>
  );

  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;
  if (!models) return null;

  const modelList = models_type === 'classification' 
    ? models.classification_models 
    : models.forecasting_models;

  // Filter out old models unless explicitly shown
  const filteredModels = modelList?.filter(model => 
    showOldModels || !model.is_old
  ) || [];

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg text-primary font-semibold">
          Available {models_type.charAt(0).toUpperCase() + models_type.slice(1)} Models
        </h2>
        
        <div className="flex gap-2">
          {models.has_old_model && (
            <button
              onClick={restoreOldModel}
              className="flex items-center gap-1 text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200"
              title="Restore previous model"
            >
              <FaHistory className="text-xs" />
              <span>Restore Previous</span>
            </button>
          )}
          
          <button
            onClick={() => setShowOldModels(!showOldModels)}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            {showOldModels ? 'Hide old models' : 'Show old models'}
          </button>
        </div>
      </div>
      
      <div className="bg-white p-3 rounded border">
        <div className="flex items-center gap-2 mb-6">
          {models_type === 'classification' ? (
            <FaRobot className="text-blue-500" />
          ) : (
            <GiWindTurbine className="text-green-500" />
          )}
          <h3 className="font-medium text-gray-700">
            {models_type === 'classification' ? 'Classification' : 'Forecasting'} Models
            <span className="ml-2 text-xs font-normal text-gray-500">
              (Current: {models.current_model.replace('(current)', '').trim()})
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModels.map((model) => (
            <div 
              key={model.model_name}
              className={`border rounded p-3 flex flex-col ${
                model.is_current ? 'border-primary bg-primary/10' : 
                model.is_old ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`font-medium ${
                  model.is_current ? 'text-primary' : 
                  model.is_old ? 'text-yellow-700' : 'text-gray-700'
                }`}>
                  {model.model_name.toUpperCase()}
                  {model.is_tuned && <span className="text-xs ml-1 text-green-600">(tuned)</span>}
                  {model.is_old && <span className="text-xs ml-1 text-yellow-600">(old)</span>}
                </span>
                
                {model.is_current ? (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Active
                  </span>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setActiveModel(model.model_name)}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      Set Active
                    </button>
                    {model.can_delete && (
                      <button
                        onClick={() => deleteModel(model.model_name)}
                        className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                        title="Delete model"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mt-auto pt-2 border-t border-gray-100 text-xs text-gray-500">
                {model.is_current && (
                  <button 
                    onClick={() => fetchModels()}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    <FaSyncAlt className="text-xs" />
                    <span>Refresh Status</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}