'use client'
import { useDataStore } from "@/app/lib/dataStore";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";

export default function DateCard(){
    const data = useDataStore((state) => state.data);
    const [minTime, setMinTime] = useState('')
    const [maxTime, setMaxTime] = useState('')
    useEffect(()=>{
            if (!data || data.length === 0) return;
            console.log(data);
            setMinTime(data[0]?.Timestamp)
            setMaxTime(data[data.length - 1]?.Timestamp)
        },[data])
    return(
        <div className="px-16 p-8 shadow-md border rounded flex flex-row justify-between">
            <p className="text-center text-sm text-gray-700">From <span className="text-text font-bold text-base mx-2 ">{minTime}</span> to <span className="text-text font-bold text-base mx-2">{maxTime}</span></p>
            <button>
                <FaFilter/>
            </button>
        </div>
    )
}

//fix scaling 
//generalize stats cards