'use client';

import { useEffect, useState, useCallback } from 'react';
import { FaRobot, FaSyncAlt, FaTrash } from 'react-icons/fa';
import { GiWindTurbine } from 'react-icons/gi';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

type ModelInfo = {
  name: string;
  version: string;
  path: string;
  is_current: boolean;
  is_tuned: boolean;
};

type ModelsResponse = {
  models: ModelInfo[];
  current_model: string | null;
};

export default function ModelInfo({
  models_type
}: {
  models_type: 'classification' | 'forecasting';
}) {
  const [models, setModels] = useState<ModelsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

      setModels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load model information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [models_type]);

  const setActiveModel = async (modelName: string, version: string) => {
    try {
      const response = await fetch(`/api/set_active_model/${models_type}/${modelName}/${version}`, {
        method: 'POST',
      });
    
      if (!response.ok) {
        throw new Error(await response.text());
      }
    
      toast.success(`Model ${modelName} ${version} set as active`);
      fetchModels();
    } catch (err) {
      toast.error(`Failed to set active model: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  const deleteModel = async (modelName: string, version: string) => {
    if (!confirm(`Are you sure you want to delete ${modelName} ${version}? This cannot be undone.`)) {
      return;
    }
  
    try {
      const response = await fetch(`/api/delete_model/${models_type}/${modelName}/${version}`, {
        method: 'DELETE',
      });
    
      if (!response.ok) {
        throw new Error(await response.text());
      }
    
      toast.success(`Model ${modelName} ${version} deleted`);
      fetchModels();
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

  // Group models by name
  const modelGroups = models.models.reduce((groups, model) => {
    if (!groups[model.name]) {
      groups[model.name] = [];
    }
    groups[model.name].push(model);
    return groups;
  }, {} as Record<string, ModelInfo[]>);

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg text-primary font-semibold">
          Available {models_type.charAt(0).toUpperCase() + models_type.slice(1)} Models
        </h2>
        <button 
          onClick={() => fetchModels()}
          className="flex items-center gap-1 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200"
        >
          <FaSyncAlt className="text-xs" />
          <span>Refresh</span>
        </button>
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
            {models.current_model && (
              <span className="ml-2 text-xs font-normal text-gray-500">
                (Current: {models.current_model})
              </span>
            )}
          </h3>
        </div>

        <div className="space-y-4">
          {Object.entries(modelGroups).map(([modelName, versions]) => (
            <div key={modelName} className="border rounded p-3">
              <h4 className="font-medium text-lg mb-2">{modelName.toUpperCase()}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {versions.map((model) => (
                  <div 
                    key={model.version}
                    className={`border rounded p-2 flex flex-col ${
                      model.is_current ? 'border-primary bg-primary/10' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={model.is_current ? 'font-semibold text-primary' : 'text-gray-700'}>
                        {model.version}
                        {model.is_tuned && <span className="text-xs ml-1 text-green-600">(tuned)</span>}
                      </span>
                      
                      {model.is_current ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Active
                        </span>
                      ) : (
                        <div className="flex gap-1">
                          <button
                            onClick={() => setActiveModel(model.name, model.version)}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                          >
                            Set Active
                          </button>
                          <button
                            onClick={() => deleteModel(model.name, model.version)}
                            className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                            title="Delete model"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}