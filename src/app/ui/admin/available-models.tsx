'use client';

import { useEffect, useState, useCallback } from 'react';
import { FaRobot, FaSyncAlt, FaTrash, FaChartLine } from 'react-icons/fa';
import { GiWindTurbine } from 'react-icons/gi';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useDataStore } from '@/app/lib/dataStore';

type ModelInfo = {
  name: string;
  version: string;
  path: string;
  is_current: boolean;
  creation_date: string;
  is_tuned: boolean;
};

type ModelsResponse = {
  models: ModelInfo[];
  current_model: string | null;
};

type ButtonState = {
  active: Record<string, boolean>;
  delete: Record<string, boolean>;
  evaluate: Record<string, boolean>;
};

export default function ModelInfo({
  models_type
}: {
  models_type: 'classification' | 'forecasting';
}) {
  const [models, setModels] = useState<ModelsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [evaluatedModels, setEvaluatedModels] = useState<string[]>([]);
  const [buttonStates, setButtonStates] = useState<ButtonState>({
    active: {},
    delete: {},
    evaluate: {}
  });
  const { 
    uploadedData, 
    forecastEvaluation,
    tuningResults,
    setTuningResults, 
    setForecastEvaluation,
    clearTuningResults,
    clearForecastEvaluation
  } = useDataStore();

  const fetchModels = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const endpoint = models_type === 'classification' 
        ? '/api/available_classification_models' 
        : '/api/available_forecasting_models';
      
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log("🚀 ~ fetchModels ~ data:", data)
      
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
    const modelKey = `${modelName}_${version}`;
    try {
      setButtonStates(prev => ({
        ...prev,
        active: { ...prev.active, [modelKey]: true }
      }));
      
      const response = await fetch(`/api/set_active_model/${models_type}/${modelName}/${version}`, {
        method: 'POST',
      });
    
      if (!response.ok) {
        throw new Error(await response.text());
      }
    
      toast.success(`Model ${modelName} ${version} set as active`);
      await fetchModels();
    } catch (err) {
      toast.error(`Failed to set active model: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setButtonStates(prev => ({
        ...prev,
        active: { ...prev.active, [modelKey]: false }
      }));
    }
  };
  
  const deleteModel = async (modelName: string, version: string) => {
    if (!confirm(`Are you sure you want to delete ${modelName} ${version}? This cannot be undone.`)) {
      return;
    }
  
    const modelKey = `${modelName}_${version}`;
    try {
      setButtonStates(prev => ({
        ...prev,
        delete: { ...prev.delete, [modelKey]: true }
      }));
      
      const response = await fetch(`/api/delete_model/${models_type}/${modelName}/${version}`, {
        method: 'DELETE',
      });
    
      if (!response.ok) {
        throw new Error(await response.text());
      }
    
      toast.success(`Model ${modelName} ${version} deleted`);
      await fetchModels();
      removeEvaluatedModel(modelName, version);
    } catch (err) {
      toast.error(`Failed to delete model: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setButtonStates(prev => ({
        ...prev,
        delete: { ...prev.delete, [modelKey]: false }
      }));
    }
  };

  const evaluateModel = async (modelName: string, version: string) => {
    const modelKey = `${modelName}_${version}`;
    try {
      // Check if we have data to evaluate with
      if (!uploadedData || uploadedData.length === 0) {
        throw new Error("Please upload data first before evaluating models");
      }

      // Check if already evaluated
      if (evaluatedModels.includes(modelKey)) {
        return;
      }

      // Limit to 4 evaluated models
      if (evaluatedModels.length >= 4) {
        throw new Error("You can evaluate up to 4 models at once. Remove one to evaluate another.");
      }

      setButtonStates(prev => ({
        ...prev,
        evaluate: { ...prev.evaluate, [modelKey]: true }
      }));

      // Determine the correct endpoint based on model type
      const endpoint = models_type === 'classification' 
        ? `/api/evaluate_classification_model/${modelName}/${version}`
        : `/api/evaluate_forecasting_model/${modelName}/${version}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to evaluate model');
      }

      const data = await response.json();
      
      // Update state with evaluation results
      if (models_type === 'classification') {
        if(evaluatedModels.length === 0) {
          setTuningResults({
            evaluation: {
              ...(useDataStore.getState().tuningResults?.evaluation || {}),
              ...data.evaluation
            },
            message: data.message
          });
        } else {
          const newTuningResults = {
            evaluation: {
              ...(tuningResults?.evaluation || {}),
              ...data.evaluation
            },
            message: data.message
          };
          setTuningResults(newTuningResults);
        }
      } else {
        if(evaluatedModels.length === 0) {
          setForecastEvaluation({
            ...data,
            results: data.results,
            forecast_horizon: data.forecast_horizon,
            message: data.message
          });
        } else {
          const neweval = {
            forecast_horizon: data.forecast_horizon,
            message: data.message,
            results: {
              ...(forecastEvaluation?.results || {}),
              ...data.results
            }
          }
          setForecastEvaluation(neweval);
        }
      }
      
      // Track evaluated model
      setEvaluatedModels([...evaluatedModels, modelKey]);
      toast.success(`Model ${modelName} ${version} evaluated successfully`);
    } catch (err) {
      toast.error(`Failed to evaluate model: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setButtonStates(prev => ({
        ...prev,
        evaluate: { ...prev.evaluate, [modelKey]: false }
      }));
    }
  };

  const removeEvaluatedModel = (modelName: string, version: string) => {
    const modelKey = `${modelName}_${version}`;
    setEvaluatedModels(evaluatedModels.filter(m => m !== modelKey));
    
    // Clear results if no more evaluated models
    if (evaluatedModels.length === 1) {
      if (models_type === 'classification') {
        clearTuningResults();
      } else {
        clearForecastEvaluation();
      }
    } else if (models_type === 'classification') {
      // Remove the model from tuningResults.evaluation
      const updatedEvaluation = { ...(tuningResults?.evaluation || {}) };
      delete updatedEvaluation[modelKey];

      const newTuningResults = {
        message: tuningResults?.message || '',
        evaluation: updatedEvaluation
      };
      setTuningResults(newTuningResults);
    } else {
      // Remove the model from forecastEvaluation.results
      const updatedResults = { ...(forecastEvaluation?.results || {}) };
      delete updatedResults[modelName];
      const newForecastEvaluation = {
        forecast_horizon: forecastEvaluation?.forecast_horizon || 0,
        message: forecastEvaluation?.message || '',
        results: updatedResults
      };
      setForecastEvaluation(newForecastEvaluation);
    }
    toast.success(`Model ${modelName} ${version} removed from evaluation`);
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
  console.log("🚀 ~ modelGroups ~ models:", models)

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg text-primary font-semibold">
          Available {models_type.charAt(0).toUpperCase() + models_type.slice(1)} Models
        </h2>
        <button 
          onClick={() => fetchModels()}
          disabled={loading}
          className="flex items-center gap-1 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          ) : (
            <FaSyncAlt className="text-xs" />
          )}
          <span>Refresh</span>
        </button>
      </div>
      
      {evaluatedModels.length > 0 && (
        <div className="mb-3 text-sm text-gray-600">
          Evaluating {evaluatedModels.length}/4 models
        </div>
      )}
      
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
                {versions.map((model) => {
                  const modelKey = `${model.name}_${model.version}`;
                  const isActiveLoading = buttonStates.active[modelKey];
                  const isDeleteLoading = buttonStates.delete[modelKey];
                  const isEvaluateLoading = buttonStates.evaluate[modelKey];
                  const isEvaluated = evaluatedModels.includes(modelKey);

                    interface FormatDate {
                    (dateString: string | undefined): string;
                    }

                    const formatDate: FormatDate = (dateString) => {
                    if (!dateString) return 'No date';
                    const date = new Date(dateString);
                    return date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    };
                  return (
                    <div 
                      key={model.version}
                      className={`border rounded p-2 flex flex-col ${
                        model.is_current ? 'border-primary bg-primary/10' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={model.is_current ? 'font-semibold text-primary' : 'text-gray-700'}>
                          {model.version}
                          <span className="text-xs text-gray-500">
                            &emsp;({formatDate(model.creation_date)})
                          </span>
                        </span>
                        
                        {model.is_current ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Active
                          </span>
                        ) : (
                          <div className="flex gap-1">
                            <button
                              onClick={() => setActiveModel(model.name, model.version)}
                              disabled={isActiveLoading}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] flex justify-center"
                              title="Set as active model"
                            >
                              {isActiveLoading ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                              ) : (
                                'Set Active'
                              )}
                            </button>
                            
                            {isEvaluated ? (
                              <button
                                onClick={() => removeEvaluatedModel(model.name, model.version)}
                                className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200"
                                title="Remove from evaluation"
                              >
                                Remove
                              </button>
                            ) : (
                              <button
                                onClick={() => evaluateModel(model.name, model.version)}
                                disabled={isEvaluateLoading || evaluatedModels.length >= 4}
                                className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={evaluatedModels.length >= 4 ? "Maximum 4 models can be evaluated" : "Evaluate model"}
                              >
                                {isEvaluateLoading ? (
                                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                  </svg>
                                ) : (
                                  <FaChartLine className="text-xs" />
                                )}
                              </button>
                            )}
                            
                            <button
                              onClick={() => deleteModel(model.name, model.version)}
                              disabled={isDeleteLoading}
                              className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete model"
                            >
                              {isDeleteLoading ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                              ) : (
                                <FaTrash className="text-xs" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}