'use client'
import StisticalCard from "./statistical-card";
import { useDataStore } from "@/app/lib/dataStore";
import { useEffect, useState } from "react";
import { IoTimeSharp } from "react-icons/io5";
import { MdWindPower } from "react-icons/md";
import { FiWind } from "react-icons/fi";
import { GrStatusUnknown } from "react-icons/gr";

export default function StatisticalCardsGrid() {
    const data = useDataStore((state) => state.data);
    const [duration, setDuration] = useState<number | undefined>(undefined);
    const [durationUnit, setDurationUnit] = useState<string | undefined>(undefined);
    const [avgPower, setAvgPower] = useState<number | undefined>(undefined);
    const [avgWindSpeed, setAvgWindSpeed] = useState<number | undefined>(undefined);
    const [mostCommonStatus, setMostCommonStatus] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!data || data.length === 0) return;

        // Function to parse timestamp
        const parseTimestamp = (timestamp: string) => new Date(timestamp).getTime();

        // Calculate duration in hours
        const difference = parseTimestamp(data[data.length - 1]?.Timestamp) - parseTimestamp(data[0]?.Timestamp);
        const durationInHours = Math.floor((difference / 1000) / 3600); // Convert to hours
        if (durationInHours > 24 * 30) {
            setDuration(Math.floor(durationInHours / (24 * 30)));
            setDurationUnit("months");
        } else if (durationInHours > 24) {
            setDuration(Math.floor(durationInHours / 24));
            setDurationUnit("days");
        } else {
            setDuration(durationInHours);
            setDurationUnit("hours");
        }

        // Calculate average power output
        const powerOutputs = data.map(item => item.Power_Output).filter(val => val !== undefined);
        if (powerOutputs.length > 0) {
            setAvgPower(powerOutputs.reduce((acc, val) => acc + val, 0) / powerOutputs.length);
        }

        // Calculate average wind speed
        const windSpeeds = data.map(item => item.Wind_Speed).filter(val => val !== undefined);
        if (windSpeeds.length > 0) {
            setAvgWindSpeed(windSpeeds.reduce((acc, val) => acc + val, 0) / windSpeeds.length);
        }

        // Calculate most common status type (mode)
        const statusCounts: Record<string, number> = {};
        data.forEach(item => {
            if ((item.Status_Type).toString()) {
                statusCounts[item.Status_Type] = (statusCounts[item.Status_Type] || 0) + 1;
            }
        });
        const mostCommon = Object.entries(statusCounts).reduce((a, b) => (b[1] > a[1] ? b : a), ["", 0])[0];
        setMostCommonStatus(mostCommon);
        
    }, [data]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-10">
            {data && data.length > 0 && (
                <>
                    <StisticalCard 
                        stat={duration} 
                        title="Duration" 
                        unit={durationUnit}
                        Icon={IoTimeSharp}  
                    />
                    <StisticalCard 
                        stat={avgPower?.toFixed(2)} 
                        title="Average Power Output" 
                        unit="kW" 
                        Icon={MdWindPower}  
                    />
                    <StisticalCard 
                        stat={avgWindSpeed?.toFixed(2)} 
                        title="Average Wind Speed" 
                        unit="m/s"  
                        Icon={FiWind}  
                    />
                    <StisticalCard 
                        stat={mostCommonStatus} 
                        title="Most Common Status" 
                        unit=""  
                        Icon={GrStatusUnknown}  
                    />
                </>
            )}
        </div>
    );
}
