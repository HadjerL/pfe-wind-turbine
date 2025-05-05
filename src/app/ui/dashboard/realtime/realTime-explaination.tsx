export default function ExplainationsCard() {
    return (
        <div className="flex flex-col gap-5 p-4 md:p-8 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold">Real-Time Monitoring System Explanations</h2>
            <p className="text-gray-500">
                Understanding the real-time data and predictions from your wind turbines.
            </p>
            
            <div className="space-y-4">
                <details className="p-4 border rounded-lg group">
                    <summary className="font-semibold cursor-pointer text-primary hover:text-primary-dark">
                        Anomaly Classification Categories
                    </summary>
                    <div className="mt-3 space-y-2 text-gray-700">
                        <p><strong>● Communication:</strong> Issues related to communication systems.</p>
                        <p><strong>● Electrical system:</strong> Faults in electrical components (e.g., transformers).</p>
                        <p><strong>● Gearbox:</strong> Failures in the gearbox or related components.</p>
                        <p><strong>● Hydraulic system:</strong> Problems with hydraulic pumps or valves.</p>
                        <p><strong>● Pitch system:</strong> Issues with blade pitch control mechanisms.</p>
                        <p><strong>● Yaw system:</strong> Failures in the yaw mechanism (turbine orientation).</p>
                        <p><strong>● Other:</strong> Miscellaneous or unspecified issues.</p>
                    </div>
                </details>

                <details className="p-4 border rounded-lg group">
                    <summary className="font-semibold cursor-pointer text-primary hover:text-primary-dark">
                        Turbine Status Types
                    </summary>
                    <div className="mt-3 space-y-2 text-gray-700">
                        <p><strong>0: Normal Operation</strong> - The turbine is in normal power production mode.</p>
                        <p><strong>1: Derated Operation</strong> - Derated power generation with a power restriction.</p>
                        <p><strong>2: Idling</strong> - The asset is idling, meaning it is temporarily not generating power but is ready to resume.</p>
                        <p><strong>3: Service</strong> - The asset is in service mode (service team is at the site).</p>
                        <p><strong>4: Downtime</strong> - The asset is down due to a fault or other reasons.</p>
                        <p><strong>5: Other</strong> - Represents other operational states.</p>
                    </div>
                </details>

                <details className="p-4 border rounded-lg group">
                    <summary className="font-semibold cursor-pointer text-primary hover:text-primary-dark">
                        Real-Time System Requirements
                    </summary>
                    <div className="mt-3 space-y-2 text-gray-700">
                        <p><strong>● Data Stream:</strong> Connects directly to your SCADA system via MQTT protocol</p>
                        <p><strong>● Initial Buffer:</strong> Requires ~2 days of data (288 data points) to begin analysis</p>
                        <p><strong>● Data Format:</strong> Each message contains a complete set of turbine measurements</p>
                        <p><strong>● Update Frequency:</strong> Processes new data points as they arrive (typically every 10 minutes)</p>
                        <p><strong>● Required Fields:</strong> Timestamp, Asset_ID, and all sensor readings listed above</p>
                        <p><strong>● Monitoring:</strong> Provides continuous anomaly detection and power output forecasts</p>
                    </div>
                </details>
            </div>
        </div>
    );
}