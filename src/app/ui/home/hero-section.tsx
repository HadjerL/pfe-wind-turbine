import Image from "next/image";
import { Montserrat } from "next/font/google";
import Link from "next/link";

const montserrat = Montserrat({
    weight: ['700'],
    subsets: ['latin']
})

export default function HeroSecton(){
    return(
        <section className="grid grid-cols-1 md:grid-cols-2 p-4 md:p-24">
            <div className="flex flex-col gap-5 items-start justify-center p-8">
                <h1 className={`text-primary text-4xl font-bold leading-tight ${montserrat.className}`}>
                    AI-Powered Predictive Maintenance for Wind Turbines
                </h1>
                <p>Leverage SCADA data and AI-driven insights to detect faults early, predict energy output, and optimize maintenance for wind farms.</p>
                <Link 
                href="/dashboard" 
                className="
                px-10 py-3 bg-primary text-white font-semibold 
                rounded-lg hover:bg-primary/80
                ">
                    Get Started Now
                </Link>
            </div>
            <Image
            src={'/hero.jpg'}
            width={700}
            height={800}
            alt="hero"
            className=" rounded-t-full place-self-center md:rounded-bl-full"
            />
        </section>
    )
}