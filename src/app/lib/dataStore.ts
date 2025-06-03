import { create } from 'zustand';
import type { 
    DataPoint, 
    Forecast, 
    Classification,
    TuningResults,
} from './definitions';

interface DataStore {
    data: DataPoint[];
    classifications: Classification[];
    forecast: Forecast[];
    uploadedData: DataPoint[];
    tuningResults: TuningResults | null;
    setData: (newData: DataPoint[]) => void;
    setClassifications: (newData: Classification[]) => void;
    setForecast: (newData: Forecast[]) => void;
    setUploadedData: (newData: DataPoint[]) => void;
    setTuningResults: (results: TuningResults) => void;
    clearTuningResults: () => void;
}

export const useDataStore = create<DataStore>((set) => ({
    data: [],
    classifications: [],
    forecast: [],
    uploadedData: [],
    tuningResults: null,
    setData: (newData) => set({ data: newData }),
    setClassifications: (newData) => set({ classifications: newData }),
    setForecast: (newData) => set({ forecast: newData }),
    setUploadedData: (newData) => set({ uploadedData: newData }),
    setTuningResults: (results) => set({ tuningResults: results }),
    clearTuningResults: () => set({ tuningResults: null }),
}));