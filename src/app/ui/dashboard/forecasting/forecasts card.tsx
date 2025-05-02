import { ForecastsCarousel } from "./forecasts-carousel";

export default function ForecastsCard() {
    const plotTitle = "Power Output Forecasts for the next 24 hours";
    return(
        <div className="shadow-md rounded-lg">
            <div className="bg-slate-100 py-4 px-10 flex flex-row justify-between items-center">
                <h1 className="text-sm font-bold">{plotTitle}</h1>
            </div>
            <div className="p-8">
                <ForecastsCarousel />
            </div>
        </div>
    )
}