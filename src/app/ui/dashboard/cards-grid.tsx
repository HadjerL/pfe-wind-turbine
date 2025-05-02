'use client'
import { useDataStore } from "@/app/lib/dataStore";
import VarCard from "@/app/ui/dashboard/var-card";
import Uploader from "@/app/ui/dashboard/uploader";
import AnomaliesCard from "@/app/ui/dashboard/anomalies-card";
import AnomalyPercentageCard from "@/app/ui/dashboard/anomaly-percentage";
import AnomalyNormalPercentageCard from "@/app/ui/dashboard/normal-anomaly-percentage";
import DateCard from "./date-card";
import StatisticalCardsGrid from "./statistical-cards-grid";
import ForecastsCard from "./forecasting/forecasts card";

export default function CardsGrids() {
    const data = useDataStore((state) => state.data);
    const classification = useDataStore((state) => state.classifications);
    return (
        <>
            <div className="flex flex-col gap-5 p-4 md:p-8 ">
                <div>
                    <Uploader />
                </div>
                {(data.length>0 || classification.length>0) && (
                    <>
                        <DateCard />
                        <StatisticalCardsGrid />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AnomalyNormalPercentageCard />
                                <AnomalyPercentageCard />
                            </div>
                            <AnomaliesCard />
                            <VarCard />
                            <ForecastsCard />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}