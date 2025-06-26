'use client';

import { useEffect, useState, useCallback } from 'react';
import { FaRobot, FaSyncAlt, FaTrash, FaChartLine } from 'react-icons/fa';
import { GiWindTurbine } from 'react-icons/gi';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useDataStore } from '@/app/lib/dataStore';
import { ForecastHyperparameters, ModelHyperparameters } from '@/app/lib/definitions';
import ClassificationHyperparametersDisplay from './available/ClassificationHyperparametersDisplay';
import HyperparametersDisplay from './home/training/ForecastingHyperparametersDisplay';

type ModelVersion = {
  name: string;
  path: string;
  is_current: boolean;
  creation_date: string;
  is_tuned: boolean;
};

type ModelArchitecture = {
  model_type: string;
  architecture: string;
  versions: ModelVersion[];
  current_version: string | null;
  hyperparameters?: ForecastHyperparameters | ModelHyperparameters;
};

type ModelsResponse = {
  model_type: string;
  architectures: ModelArchitecture[];
  error?: string;
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
  const [expandedArchitectures, setExpandedArchitectures] = useState<Record<string, boolean>>({});
  const [loadingHyperparams, setLoadingHyperparams] = useState<Record<string, boolean>>({});
  const [hyperparamsError, setHyperparamsError] = useState<Record<string, string>>({});
  
  // Track loading states for each action per model version
  const [loadingStates, setLoadingStates] = useState<Record<string, {
    active: boolean;
    delete: boolean;
    evaluate: boolean;
  }>>({});
  
  const { 
    uploadedData, 
    forecastEvaluation,
    tuningResults,
    setTuningResults, 
    setForecastEvaluation,
    clearTuningResults,
    clearForecastEvaluation
  } = useDataStore();

  const setLoadingState = (modelKey: string, action: 'active' | 'delete' | 'evaluate', value: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [modelKey]: {
        ...(prev[modelKey] || { active: false, delete: false, evaluate: false }),
        [action]: value
      }
    }));
  };

  const fetchHyperparameters = useCallback(async (modelType: string, architecture: string) => {
    const key = `${modelType}_${architecture}`;
    try {
      setLoadingHyperparams(prev => ({ ...prev, [key]: true }));
      setHyperparamsError(prev => ({ ...prev, [key]: '' }));

      const endpoint = models_type === 'classification'
        ? `/api/get_classification_hyperparameters?modelType=${modelType}&architecture=${architecture}`
        : `/api/get_forecast_hyperparameters?architecture=${architecture}`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      
      setModels(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          architectures: prev.architectures.map(arch => {
            if (arch.model_type === modelType && arch.architecture === architecture) {
              return {
                ...arch,
                hyperparameters: data
              };
            }
            return arch;
          })
        };
      });
    } catch (err) {
      setHyperparamsError(prev => ({
        ...prev,
        [key]: err instanceof Error ? err.message : 'Failed to load hyperparameters'
      }));
      console.error(`Error loading hyperparameters for ${key}:`, err);
    } finally {
      setLoadingHyperparams(prev => ({ ...prev, [key]: false }));
    }
  }, [models_type]);

  const toggleArchitectureExpand = async (modelType: string, architecture: string) => {
    const key = `${modelType}_${architecture}`;
    
    if (!expandedArchitectures[key]) {
      const arch = models?.architectures.find(a => 
        a.model_type === modelType && a.architecture === architecture
      );
      
      if (arch && !arch.hyperparameters) {
        await fetchHyperparameters(modelType, architecture);
      }
    }
    
    setExpandedArchitectures(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const fetchModels = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const endpoint = models_type === 'classification' 
        ? '/api/available_classification_models' 
        : '/api/available_forecasting_models';
      
      const response = await fetch(endpoint);
      const data: ModelsResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load model information');
      }

      const initialExpanded: Record<string, boolean> = {};
      const initialLoading: Record<string, boolean> = {};
      const initialErrors: Record<string, string> = {};
      
      data.architectures.forEach(arch => {
        const key = `${arch.model_type}_${arch.architecture}`;
        initialExpanded[key] = false;
        initialLoading[key] = false;
        initialErrors[key] = '';
      });
      
      setExpandedArchitectures(initialExpanded);
      setLoadingHyperparams(initialLoading);
      setHyperparamsError(initialErrors);

      setModels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load model information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [models_type]);

  const setActiveModel = async (modelType: string, architecture: string, version: string) => {
    const modelKey = `${modelType}_${architecture}_${version}`;
    try {
      setLoadingState(modelKey, 'active', true);
      
      const response = await fetch(
        `/api/set_active_model/${models_type}/${modelType}/${architecture}/${version}`, 
        { method: 'POST' }
      );
    
      if (!response.ok) {
        throw new Error(await response.text());
      }
    
      toast.success(`Model ${architecture} ${version} set as active`);
      await fetchModels();
    } catch (err) {
      toast.error(`Failed to set active model: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoadingState(modelKey, 'active', false);
    }
  };
  
  const deleteModel = async (modelType: string, architecture: string, version: string) => {
    if (!confirm(`Are you sure you want to delete ${architecture}/${version}? This cannot be undone.`)) {
      return;
    }

    const modelKey = `${modelType}_${architecture}_${version}`;
    try {
      setLoadingState(modelKey, 'delete', true);

      const response = await fetch(
        `/api/delete_model/${models_type}/${modelType}/${architecture}/${version}`, 
        { method: 'DELETE' }
      );
    
      if (!response.ok) {
        throw new Error(await response.text());
      }
    
      toast.success(`Model ${architecture}/${version} deleted`);
      await fetchModels();
    } catch (err) {
      toast.error(`Failed to delete model: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoadingState(modelKey, 'delete', false);
    }
  };

  const evaluateModel = async (modelType: string, architecture: string, version: string) => {
    const modelKey = `${modelType}_${architecture}_${version}`;
    try {
      if (!uploadedData || uploadedData.length === 0) {
        throw new Error("Please upload data first before evaluating models");
      }

      if (evaluatedModels.includes(modelKey)) {
        return;
      }

      if (evaluatedModels.length >= 4) {
        throw new Error("You can evaluate up to 4 models at once. Remove one to evaluate another.");
      }

      setLoadingState(modelKey, 'evaluate', true);
      
      const endpoint = models_type === 'classification' 
        ? `/api/evaluate_classification_model/${modelType}/${architecture}/${version}`
        : `/api/evaluate_forecasting_model/${modelType}/${architecture}/${version}`;
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
      
      if (models_type === 'classification') {
        setTuningResults({
          evaluation: {
            ...(tuningResults?.evaluation || {}),
            [modelKey]: data.evaluation
          },
          message: data.message
        });
      } else {
        setForecastEvaluation({
          forecast_horizon: data.forecast_horizon,
          message: data.message,
          results: {
            ...(forecastEvaluation?.results || {}),
            [modelKey]: data.results
          }
        });
      }
      
      setEvaluatedModels([...evaluatedModels, modelKey]);
      toast.success(`Model ${architecture} ${version} evaluated successfully`);
    } catch (err) {
      toast.error(`Failed to evaluate model: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoadingState(modelKey, 'evaluate', false);
    }
  };

  const removeEvaluatedModel = (modelType: string, architecture: string, version: string) => {
    const modelKey = `${modelType}_${architecture}_${version}`;
    const newEvaluatedModels = evaluatedModels.filter(m => m !== modelKey);
    setEvaluatedModels(newEvaluatedModels);
    
    if (models_type === 'classification') {
      const updatedEvaluation = { ...(tuningResults?.evaluation || {}) };
      delete updatedEvaluation[modelKey];
      
      if (newEvaluatedModels.length === 0) {
        clearTuningResults();
      } else {
        setTuningResults({
          message: tuningResults?.message || '',
          evaluation: updatedEvaluation
        });
      }
    } else {
      const updatedResults = { ...(forecastEvaluation?.results || {}) };
      delete updatedResults[modelKey];
      
      if (newEvaluatedModels.length === 0) {
        clearForecastEvaluation();
      } else {
        setForecastEvaluation({
          forecast_horizon: forecastEvaluation?.forecast_horizon || 0,
          message: forecastEvaluation?.message || '',
          results: updatedResults
        });
      }
    }
    toast.success(`Model ${architecture} ${version} removed from evaluation`);
  };

  const formatDate = (dateString: string | undefined): string => {
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

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg text-primary font-semibold">
          Available {models.model_type.charAt(0).toUpperCase() + models.model_type.slice(1)} Models
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
            {models.model_type.charAt(0).toUpperCase() + models.model_type.slice(1)} Models
          </h3>
        </div>

        <div className="space-y-6">
          {models.architectures.map((archi) => {
            const architectureKey = `${archi.model_type}_${archi.architecture}`;
            const isExpanded = expandedArchitectures[architectureKey];
            const isLoading = loadingHyperparams[architectureKey];
            const error = hyperparamsError[architectureKey];
            
            return (
              <div key={architectureKey} className="border rounded p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-lg">
                      {archi.model_type.toUpperCase()} - {archi.architecture}
                    </h4>
                    {archi.current_version && (
                      <span className="text-sm text-gray-500">
                        Current version: {archi.current_version}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleArchitectureExpand(archi.model_type, archi.architecture)}
                      disabled={isLoading}
                      className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-1">
                          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                          </svg>
                          Loading...
                        </span>
                      ) : isExpanded ? (
                        'Hide Parameters'
                      ) : (
                        'View Parameters'
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mb-4">
                    {error ? (
                      <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                        Failed to load hyperparameters: {error}
                        <button 
                          onClick={() => fetchHyperparameters(archi.model_type, archi.architecture)}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          Retry
                        </button>
                      </div>
                    ) : isLoading ? (
                      <div className="flex justify-center p-4">
                        <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                      </div>
                    ) : archi.hyperparameters ? (
                      models_type === 'classification' ? (
                        <ClassificationHyperparametersDisplay
                          results={{ hyperparameters: archi.hyperparameters as ModelHyperparameters }}
                        />
                      ) : (
                        <HyperparametersDisplay
                          results={archi.hyperparameters as ForecastHyperparameters}
                        />
                      )
                    ) : (
                      <div className="text-gray-500 text-sm p-2 bg-gray-50 rounded">
                        No hyperparameters available
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {archi.versions.map((version) => {
                    const modelKey = `${archi.model_type}_${archi.architecture}_${version.name}`;
                    const isCurrent = version.name === archi.current_version;
                    const isEvaluated = evaluatedModels.includes(modelKey);
                    const currentLoading = loadingStates[modelKey] || {
                      active: false,
                      delete: false,
                      evaluate: false
                    };

                    return (
                      <div 
                        key={version.name}
                        className={`border rounded p-3 flex flex-col ${
                          isCurrent ? 'border-primary bg-primary/10' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className={isCurrent ? 'font-semibold text-primary' : 'text-gray-700'}>
                              {version.name}
                            </span>
                            <div className="text-xs text-gray-500">
                              {formatDate(version.creation_date)}
                            </div>
                          </div>
                          
                          {isCurrent ? (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Active
                            </span>
                          ) : (
                            <div className="flex gap-1">
                              <button
                                onClick={() => setActiveModel(archi.model_type, archi.architecture, version.name)}
                                disabled={currentLoading.active}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] flex justify-center"
                                title="Set as active model"
                              >
                                {currentLoading.active ? (
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
                                  onClick={() => removeEvaluatedModel(archi.model_type, archi.architecture, version.name)}
                                  className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200"
                                  title="Remove from evaluation"
                                >
                                  Remove
                                </button>
                              ) : (
                                <button
                                onClick={() => evaluateModel(archi.model_type, archi.architecture, version.name)}
                                disabled={currentLoading.evaluate || evaluatedModels.length >= 4}
                                className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={evaluatedModels.length >= 4 ? "Maximum 4 models can be evaluated" : "Evaluate model"}
                              >
                                {currentLoading.evaluate ? (
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
                                onClick={() => deleteModel(archi.model_type, archi.architecture, version.name)}
                                disabled={currentLoading.delete}
                                className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete model"
                              >
                                {currentLoading.delete ? (
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

                        {version.is_tuned && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded self-start">
                            Tuned
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}