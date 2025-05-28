'use client'
import { useDataStore } from "@/app/lib/dataStore";
import { useEffect, useState } from "react";
// import { FaFilter } from "react-icons/fa";

export default function DateCard() {
    const data = useDataStore((state) => state.data);
    const [minTime, setMinTime] = useState('');
    const [maxTime, setMaxTime] = useState('');

    useEffect(() => {
        if (!data || data.length === 0) return;
        setMinTime(data[0]?.Timestamp);
        setMaxTime(data[data.length - 1]?.Timestamp);
    }, [data]);

    return (
        <div className="px-8 py-6 shadow-md border rounded-lg flex justify-between items-center bg-white">
            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4">
                <p className="text-gray-700 text-sm md:text-base hidden md:block">
                    From <span className="font-semibold text-base mx-2">{minTime}</span> to <span className="font-semibold text-base mx-2">{maxTime}</span>
                </p>
                <div className="flex flex-col gap-2 text-gray-700 text-sm md:text-base md:hidden">
                    <div>
                        <p>From</p>
                        <p><span className="font-semibold text-base">{minTime}</span></p>
                    </div>
                    <div>
                        <p>to</p>
                        <p><span className="font-semibold text-base">{maxTime}</span></p>
                    </div>
                </div>
            </div>
            {/* <button className="flex items-center justify-center p-2 bg-primary hover:bg-primary/80 text-white rounded-lg shadow-md transition duration-300"> */}
                {/* <FaFilter className="text-lg" /> */}
            {/* </button> */}
        </div>
    );
}

//fix scaling 
//generalize stats cards