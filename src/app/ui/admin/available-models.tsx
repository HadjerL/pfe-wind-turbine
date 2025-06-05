// app/ui/admin/model-info.tsx
'use client';

import { useEffect, useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import { GiWindTurbine } from 'react-icons/gi';

type ModelInfo = {
  model_name: string;
  is_current: boolean;
};

type ModelsResponse = {
  classification_models?: ModelInfo[];
  forecasting_models?: ModelInfo[];
  current_model: string;
};

export default function ModelInfo({
  models_type
}: {
  models_type: 'classification' | 'forecasting';
}) {
  const [models, setModels] = useState<ModelsResponse | null>(null);
  console.log("🚀 ~ models:", models)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        
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
    };

    fetchModels();
  }, [models_type]);

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
    //  const currentModel = models.current_model.replace('(current)', '').trim();

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow mb-4">
      <h2 className="text-lg text-primary font-semibold mb-3">
        Available Models
      </h2>
      
      <div className="bg-white p-3 rounded border">
        <div className="flex items-center gap-2 mb-6">
          {models_type === 'classification' ? (
            <FaRobot className="text-blue-500" />
          ) : (
            <GiWindTurbine className="text-green-500" />
          )}
          <h3 className="font-medium text-gray-700">
            {models_type === 'classification' ? 'Classification' : 'Forecasting'} Models
          </h3>
        </div>

        <ul className="gap-2 md:gap-6 items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {modelList && modelList.length > 0 ? (
            modelList.map(({ model_name, is_current }) => (
              <li 
                  key={model_name} 
                  className="
                  flex justify-between border border-primary 
                  rounded p-2 mb-2 bg-primary/10 shadow-sm w-full
              ">
                  <span className={is_current ? 'font-semibold text-primary' : 'text-text'}>
                      {model_name.toUpperCase()}
                  </span>
                  {is_current && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Active
                      </span>
                  )}
              </li>
            ))
          ) : (
            <li className="text-gray-500 col-span-full text-center py-4">
              No models available.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}