'use client';

import { useDataStore } from "@/app/lib/dataStore";
import ForecastHourCard from "./forecast-hour-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useMemo } from "react";

export function ForecastsCarousel() {
    const forecasts = useDataStore((state) => state.forecast);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
        setScrollLeft(carouselRef.current?.scrollLeft || 0);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !carouselRef.current) return;
        e.preventDefault();
        const x = e.pageX - (carouselRef.current.offsetLeft || 0);
        const walk = (x - startX) * 2; // Adjust scroll speed
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (!carouselRef.current) return;
        const scrollAmount = direction === 'left' ? -300 : 300;
        carouselRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    const { peakHour, idealHour } = useMemo(() => {
        if (forecasts.length === 0) return { peakHour: null, idealHour: null };

        let peak = forecasts[0];
        let ideal = forecasts.find(f => f.power_output > 0) || forecasts[0];
        
        forecasts.forEach(forecast => {
            // Find hour with maximum power output
            if (forecast.power_output > peak.power_output) {
                peak = forecast;
            }
            
            // Find hour with lowest positive power output (ideal for maintenance)
            if (forecast.power_output > 0 && forecast.power_output < ideal.power_output) {
                ideal = forecast;
            }
        });

        return {
            peakHour: peak,
            idealHour: ideal
        };
    }, [forecasts]);

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            hour12: true
        }).replace(':00', '');
    };

    return (
        <div className="space-y-2">
            {/* Statistics Panel */}
            {forecasts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 bg-white">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-gray-500 ">Peak Production</p>
                            <p className="text-lg font-semibold">
                                {peakHour ? peakHour.power_output.toFixed(3) : 'N/A'} kW
                                <span className="ml-2 text-sm font-normal text-blue-600">
                                    {peakHour ? `at ${formatTime(peakHour.timestamp)}` : ''}
                                </span>
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Ideal Maintenance Time</p>
                            <p className="text-lg font-semibold">
                                {idealHour ? idealHour.power_output.toFixed(3) : 'N/A'} kW
                                <span className="ml-2 text-sm font-normal text-green-600">
                                    {idealHour ? `at ${formatTime(idealHour.timestamp)}` : ''}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Carousel Container (keep your existing carousel code) */}
            <div className="relative group">
                {/* Navigation Arrows */}
                <button 
                    onClick={() => scroll('left')}
                    className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-opacity opacity-0 group-hover:opacity-100"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                
                <button 
                    onClick={() => scroll('right')}
                    className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-opacity opacity-0 group-hover:opacity-100"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>

                {/* Carousel Items */}
                <div
                    ref={carouselRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="flex gap-4 py-4 px-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory w-full"
                >
                    {forecasts.length > 0 ? (
                        forecasts.map((forecast, index) => (
                            <div 
                                key={`${forecast.timestamp}-${index}`} 
                                className={`snap-start flex-shrink-0 ${
                                    forecast.timestamp === peakHour?.timestamp ? 'ring-2 ring-blue-500' : 
                                    forecast.timestamp === idealHour?.timestamp ? 'ring-2 ring-green-500' : ''
                                } rounded-lg transition-all`}
                            >
                                <ForecastHourCard forecast={forecast} />
                            </div>
                        ))
                    ) : (
                        <div className="w-full flex justify-center items-center h-32">
                            <p className="text-gray-500">No forecast data available</p>
                        </div>
                    )}
                </div>

                {/* Scroll indicator dots (for mobile) */}
                <div className="flex justify-center gap-1 mt-2 md:hidden">
                    {forecasts.length > 0 && Array.from({ length: Math.min(5, forecasts.length) }).map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-gray-300"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}