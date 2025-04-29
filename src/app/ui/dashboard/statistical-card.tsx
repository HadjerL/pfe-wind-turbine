'use client'

interface StisticalCardProps {
    title: string;
    stat: string | number | undefined;
    unit?: string;
    Icon: React.ElementType;
}

export default function StisticalCard({ title, stat, unit, Icon }: StisticalCardProps) {
    return (
        <div className="flex items-center justify-between bg-white border rounded-lg shadow-md p-6 w-full">
            <div className="flex flex-col">
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800">
                    {stat ?? 'N/A'} <span className="text-lg text-gray-500">{unit}</span>
                </p>
            </div>
            <div className="flex items-center justify-center w-14 h-14 bg-primary rounded-full shadow-md">
                <Icon className="text-white text-4xl " />
            </div>
        </div>
    );
}
