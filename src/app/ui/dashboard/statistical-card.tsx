'use client'
import { useDataStore } from "@/app/lib/dataStore";
import { useEffect, useState } from "react";
import { Inter } from 'next/font/google'
import { IoTimeSharp } from "react-icons/io5";

const inter = Inter({ subsets: ['latin'] })

export default function StisticalCard(){
    const data = useDataStore((state) => state.data);
    const [duration, setDuration] = useState<number | undefined>(undefined);
    useEffect(()=>{
        if (!data || data.length === 0) return;
        console.log(data);

        const parseTimestamp = (timestamp: string) => new Date(timestamp).getTime();
        const difference = parseTimestamp(data[data.length - 1]?.Timestamp) - parseTimestamp(data[0]?.Timestamp);
        const durationSeconds = difference / 1000;
        const durationMinutes = durationSeconds / 60;
        const durationHours = durationMinutes / 60;
        setDuration(Math.floor(durationHours))
    },[data])

    return(
        <div className={`flex flex-row gap-4 justify-evenly border items-start shadow-md rounded p-8 ${inter.className}`}>
            <div className="flex flex-col gap-1">
                <p className="text-sm text-slate-500">Duration</p>
                <p><span className="text-5xl font-semibold">{duration}</span> Hours</p>
            </div>
            <div className="bg-primary rounded-full p-4">
                <IoTimeSharp className="text-3xl text-white"/>
            </div>
        </div>
    )
}