import { create } from "zustand";
import type { DataPoint } from "./definitions";
import type { Classification } from "./definitions";

interface DataStore {
    data: DataPoint[];
    classifications: Classification[];
    setData: (newData: DataPoint[]) => void;
    setClassifications: (newData: Classification[]) => void;
}

export const useDataStore = create<DataStore>((set) => ({
    data: [],
    classifications: [],
    setData: (newData) => set({ data: newData }),
    setClassifications: (newData) => set({ classifications: newData }),
}));
