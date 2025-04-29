export default function StatisticalCardsSkeleton() {
    return (
        <div className="grid grid-cols-4 gap-10 animate-pulse">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="p-6 bg-gray-200 rounded-lg h-24"></div>
            ))}
        </div>
    );
}
