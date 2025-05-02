import { Forecast } from "@/app/lib/definitions"

export default function ForecastHourCard({ forecast }: { forecast: Forecast }) {
    // Format timestamp to show hour and AM/PM
    const formattedTime = new Date(forecast.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        hour12: true
    }).replace(':00', ''); // Removes minutes if they're :00

    // Format power output to 3 decimal places
    const formattedPower = forecast.power_output.toFixed(3);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 w-32 flex flex-col items-center justify-center border hover:shadow-lg transition-shadow duration-200">
            <div className="text-sm font-medium text-gray-700 mb-1">
                {formattedTime}
            </div>
            <div className="text-2xl font-bold text-primary">
                {formattedPower}
                <span className="text-sm font-normal text-gray-700 ml-1">kW</span>
            </div>
            <div className="mt-2 text-xs text-gray-600">
                Power Output
            </div>
        </div>
    )
}