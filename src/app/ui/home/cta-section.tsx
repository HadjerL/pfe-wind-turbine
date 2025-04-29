import Link from "next/link";

export default function CTASection(){
    return(
        <section id="cta" className="py-16 px-4 md:px-24 bg-primary text-white text-center">
            <h2 className="text-4xl font-bold">Take Control of Your Wind Farm Maintenance</h2>
            <p className="mt-2">Start using AI-powered insights today.</p>
            <Link 
                href="/dashboard" 
                className="inline-block mt-6 px-10 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-200"
            >
                Get Started Now
            </Link>
        </section>
    )
}