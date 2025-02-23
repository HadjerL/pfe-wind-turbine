import VarCard from "@/app/ui/dashboard/var-card"
import Uploader from "@/app/ui/dashboard/uploader"
import AnomaliesCard from "@/app/ui/dashboard/anomalies-card"
import AnomalyPercentageCard from "@/app/ui/dashboard/anomaly-percentage"
import AnomalyNormalPercentageCard from "./normal-anomaly-percentage"

export default function CardsGrids(){

    return(
        <>
            <div className="flex flex-col gap-5 p-8">
                <div>
                    <Uploader/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <AnomalyNormalPercentageCard/>
                        <AnomalyPercentageCard/>
                    </div>
                    <AnomaliesCard/>
                    <VarCard/>
                </div>
            </div>
        </>
    )
}