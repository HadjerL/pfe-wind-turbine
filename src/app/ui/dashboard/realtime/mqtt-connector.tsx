'use client'
import { useEffect, useState, useCallback } from "react";
import { useDataStore } from "@/app/lib/dataStore";
import { DataPoint, Classification, Forecast } from "@/app/lib/definitions";
import { useMqtt } from "@/app/hooks/useMqtt";

const REQUIRED_COLUMNS = [
    'Timestamp',
    'Asset_ID',
    'Status_Type',
    'Rotor_Speed',
    'Rotational_Speed',
    'Gearbox_Oil_Inlet_Temperature',
    'RMS_Current_Phase_1_HV_Grid',
    'RMS_Current_Phase_2_HV_Grid',
    'RMS_Current_Phase_3_HV_Grid',
    'RMS_Voltage_Phase_1_HV_Grid',
    'RMS_Voltage_Phase_2_HV_Grid',
    'RMS_Voltage_Phase_3_HV_Grid',
    'Min_Pitch_Angle',
    'Rotor_Bearing_Temperature',
    'Outside_Temperature',
    'Wind_Speed',
    'Power_Output',
    'Nacelle_Air_Pressure',
    'Wind_Direction_Sin',
    'Wind_Direction_Cos'
];

const MINIMUM_ROWS = 576 / 2;
const MQTT_BROKER_URL = 'ws://192.168.1.33:9001/mqtt';
// const MQTT_BROKER_URL = 'ws://192.168.251.118:9001/mqtt';
// const MQTT_BROKER_URL = 'ws://test.mosquitto.org:8080/mqtt';
const MQTT_OPTIONS = {
    clientId: 'realtime-client-' + Math.random().toString(16).substring(2, 8),
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
};

export default function RealTimeSystem() {
    const setDataPoints = useDataStore((state) => state.setData);
    const setClassifications = useDataStore((state) => state.setClassifications);
    const setForecast = useDataStore((state) => state.setForecast);
    
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentAssetId, setCurrentAssetId] = useState<string | null>(null);
    const [buffer, setBuffer] = useState<DataPoint[]>([]);
    const [currentDataPoint, setCurrentDataPoint] = useState<Partial<DataPoint>>({});

    const { client, status, subscribe, unsubscribe } = useMqtt(MQTT_BROKER_URL, MQTT_OPTIONS);

    const fetchClassifications = useCallback(async (data: DataPoint[]) => {
        setIsLoading(true);
        try {
            const response = await fetch("http://192.168.1.33:5000/predict", {
            // const response = await fetch("http://192.168.251.118:5000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok){ 
                const errorText = await response.text();
                console.log("🚀 ~ fetchClassifications ~ errorText:", errorText)
                throw new Error("Failed to fetch classifications")
            };
            const classificationResult: Classification[] = await response.json();
            setClassifications(classificationResult);
        } catch (err) {
            setError("Error fetching classification data: " + (err instanceof Error ? err.message : "Unknown error"));
        } finally {
            setIsLoading(false);
        }
    }, [setClassifications]);

    const fetchForecast = useCallback(async (data: DataPoint[]) => {
        setIsLoading(true);
        try {
            const res = await fetch("http://192.168.1.33:5000/predict_forecast", {
            // const res = await fetch("http://192.168.251.118:5000/predict_forecast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data.slice(-MINIMUM_ROWS)),
            });
    
            if (!res.ok) {
                const errorText = await res.text();
                console.log("🚀 ~ fetchForecast ~ errorText:", errorText)
                throw new Error(errorText)
            };
            const forecast: Forecast[] = await res.json();
            setForecast(forecast);
            
            console.log("🚀 ~ fetchForecast ~ forecast:", forecast)
            setError(null)
        } catch (err) {
            // setError("Error fetching forecast data: " + (err instanceof Error ? err.message : "Unknown error"));
            console.log("Error fetching forecast data: " + (err instanceof Error ? err.message : "Unknown error"))
        } finally {
            setIsLoading(false);
        }
    }, [setForecast]);

    useEffect(() => {
        if (!client) return;
    
        const handleMessage = (topic: string, message: Buffer) => {
            try {
                const parts = topic.split('/');
                if (parts.length !== 3 || parts[0] !== 'assets' || parts[2] !== 'row') return;
                
                const assetId = parts[1];
                let rawData: Record<string, string | number>;
                
                try {
                    rawData = JSON.parse(message.toString());
                    
                    // Validate required columns
                    const missingColumns = REQUIRED_COLUMNS.filter(col => !(col in rawData));
                    if (missingColumns.length > 0) {
                        console.error(`Missing columns in row data: ${missingColumns.join(', ')}`);
                        return;
                    }
                    
                    // Convert to properly typed DataPoint
                    const rowData: DataPoint = {
                        Timestamp: String(rawData.Timestamp),
                        Asset_ID: Number(rawData.Asset_ID) || 0,
                        Status_Type: Number(rawData.Status_Type) || 0,
                        Rotor_Speed: Number(rawData.Rotor_Speed) || 0,
                        Rotational_Speed: Number(rawData.Rotational_Speed) || 0,
                        Gearbox_Oil_Inlet_Temperature: Number(rawData.Gearbox_Oil_Inlet_Temperature) || 0,
                        RMS_Current_Phase_1_HV_Grid: Number(rawData.RMS_Current_Phase_1_HV_Grid) || 0,
                        RMS_Current_Phase_2_HV_Grid: Number(rawData.RMS_Current_Phase_2_HV_Grid) || 0,
                        RMS_Current_Phase_3_HV_Grid: Number(rawData.RMS_Current_Phase_3_HV_Grid) || 0,
                        RMS_Voltage_Phase_1_HV_Grid: Number(rawData.RMS_Voltage_Phase_1_HV_Grid) || 0,
                        RMS_Voltage_Phase_2_HV_Grid: Number(rawData.RMS_Voltage_Phase_2_HV_Grid) || 0,
                        RMS_Voltage_Phase_3_HV_Grid: Number(rawData.RMS_Voltage_Phase_3_HV_Grid) || 0,
                        Min_Pitch_Angle: Number(rawData.Min_Pitch_Angle) || 0,
                        Rotor_Bearing_Temperature: Number(rawData.Rotor_Bearing_Temperature) || 0,
                        Outside_Temperature: Number(rawData.Outside_Temperature) || 0,
                        Wind_Speed: Number(rawData.Wind_Speed) || 0,
                        Power_Output: Number(rawData.Power_Output) || 0,
                        Nacelle_Air_Pressure: Number(rawData.Nacelle_Air_Pressure) || 0,
                        Wind_Direction_Sin: Number(rawData.Wind_Direction_Sin) || 0,
                        Wind_Direction_Cos: Number(rawData.Wind_Direction_Cos) || 0
                    };
                    
                    // Set the asset ID if not already set
                    if (!currentAssetId) {
                        setCurrentAssetId(assetId);
                    } else if (currentAssetId !== assetId) {
                        // If we get data for a different asset, reset
                        setCurrentAssetId(assetId);
                        setBuffer([]);
                        setCurrentDataPoint({});
                        return;
                    }
                    
                    // Update the current data point
                    setCurrentDataPoint(rowData);
                    
                    // Add to buffer and maintain sliding window
                    setBuffer(prevBuffer => {
                        const newBuffer = [...prevBuffer, rowData];
                        const lastBuffer = newBuffer.slice(-MINIMUM_ROWS);
                        return lastBuffer;
                    });
                    
                } catch (err) {
                    console.error("Error processing row message:", err);
                }
            } catch (err) {
                console.error("Error processing MQTT message:", err);
            }
        };
    
        client.on('message', handleMessage);
    
        return () => {
            client.off('message', handleMessage);
        };
    }, [client, currentAssetId]);

    // Subscribe to topics when connected
    useEffect(() => {
        if (status === 'Connected') {
            subscribe(`assets/+/row`);
            
            return () => {
                unsubscribe(`assets/+/row`);
            };
        }
    }, [status, subscribe, unsubscribe]);

    // Process buffer when it reaches minimum rows
    useEffect(() => {
        if (buffer.length >= MINIMUM_ROWS) {
            // Update global data store
            setDataPoints(buffer);
            
            // Only make API calls if we have exactly MINIMUM_ROWS or on new data after that
            if (buffer.length === MINIMUM_ROWS || buffer.length % 6 === 0) {
                const dataToSend = buffer.slice(-MINIMUM_ROWS);
                fetchClassifications(dataToSend);
                fetchForecast(dataToSend);
            }
        }
    }, [buffer, setDataPoints,fetchClassifications, fetchForecast]);

    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-lg font-bold mb-2 text-primary">Real-time SCADA Connection</h2>
            
            <div className="mb-4">
                <p className="font-semibold">Connection Status: 
                    <span className={`ml-2 ${
                        status === 'Connected' ? 'text-green-500' : 
                        status === 'Connecting' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                        {status}
                    </span>
                </p>
                {currentAssetId && (
                    <p className="text-sm text-gray-600">Receiving data for Asset ID: {currentAssetId}</p>
                )}
            </div>
            
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <p>Data Buffer: {buffer.length} rows</p>
                    <button 
                        onClick={() => {
                            setBuffer([]);
                            setCurrentDataPoint({});
                            setCurrentAssetId(null);
                            setDataPoints([]);
                            setClassifications([]);
                            setForecast([]);
                            setError(null);
                        }} 
                        className="bg-gray-200 border py-1 px-6 rounded-lg"
                    >
                        Reset
                    </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (buffer.length / MINIMUM_ROWS) * 100)}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-500">
                    {buffer.length < MINIMUM_ROWS 
                        ? `Need ${MINIMUM_ROWS - buffer.length} more rows to start analysis`
                        : 'Analysis active - maintaining sliding window of 288 rows'}
                </p>
            </div>
            
            {isLoading && (
                <p className="text-blue-500 mt-2 animate-pulse">Processing data... Please wait.</p>
            )}
            
            {error && <p className="text-red-500 mt-2">{error}</p>}
            
            {buffer.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-medium mb-2">Latest Data Point</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm max-w-full">
                        {REQUIRED_COLUMNS.slice(0, 8).map(column => (
                            <div key={column} className="flex justify-between max-w-full">
                                <span className="text-gray-600 truncate">{column}:</span>
                                <span className="font-medium truncate">
                                    {currentDataPoint[column as keyof DataPoint] ?? '--'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}


