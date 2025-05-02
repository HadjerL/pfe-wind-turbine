import { create } from "zustand";
import type { DataPoint, Forecast } from "./definitions";
import type { Classification } from "./definitions";

interface DataStore {
    data: DataPoint[];
    classifications: Classification[];
    forecast: Forecast[];
    setData: (newData: DataPoint[]) => void;
    setClassifications: (newData: Classification[]) => void;
    setForecast: (newData: Forecast[]) => void;
}

export const useDataStore = create<DataStore>((set) => ({
    data: [],
    classifications: [],
    forecast: [],
    setData: (newData) => set({ data: newData }),
    setClassifications: (newData) => set({ classifications: newData }),
    setForecast: (newData) => set({ forecast: newData }),
}));
