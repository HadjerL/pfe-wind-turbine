import Image from "next/image";


export default function Showcase(){
    return(
        <section id="showcase" className="py-16 px-4 sm:px-24 bg-gray-100 text-center">
            <h2 className="text-3xl font-bold text-primary">Gain Insights into Your Wind Turbine Data</h2>
            <p className="text-gray-600 mt-2">Upload SCADA data to detect anomalies, predict failures, and optimize maintenance planning.</p>
            <div className="mt-8 flex flex-row justify-center gap-5 py-4 px-24 sm:p-8">
                <Image src="/dashboard-preview.png" width={400} height={300} alt="Dashboard Preview" className="rounded-lg shadow-lg translate-x-4 translate-y-8 border" />
                <Image src="/dashboard-preview2.png" width={400} height={300} alt="Dashboard Preview" className="rounded-lg shadow-lg -translate-x-4 -translate-y-8 border" />
            </div>
        </section>
    )
}