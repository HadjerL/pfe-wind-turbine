export default function ExplainationsCard() {
    return (
        <div className="flex flex-col gap-5 p-4 md:p-8 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold">System Explanations</h2>
            <p className="text-gray-500">
                Understanding the data and predictions made by the system.
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
                        Data Requirements
                    </summary>
                    <div className="mt-3 space-y-2 text-gray-700">
                        <p>● CSV files must contain at least 288 rows of data (48 hours at 10-minute intervals).</p>
                        <p>● Required columns include Timestamp, Asset_ID, and various sensor readings.</p>
                        <p>● The system analyzes patterns to detect anomalies and forecast power output.</p>
                    </div>
                </details>
            </div>
        </div>
    );
}