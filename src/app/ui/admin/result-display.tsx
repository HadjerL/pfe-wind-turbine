'use client';

import { useDataStore } from '@/app/lib/dataStore';
import { ModelTuningResults } from './classification-tuning-results';

export function ResultsDisplay() {
  const tuningResults = useDataStore((state) => state.tuningResults);

  return (
    <div>
      {tuningResults ? (
        <ModelTuningResults results={tuningResults} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No tuning results available. Please upload data and run the tuning process first.
          </p>
        </div>
      )}
    </div>
  );
}