// app/managing/graphical/multi-label/page.tsx
'use client';

import ModelCharts from "@/app/ui/admin/graphs/Modelcharts";

export default function MultiLabelPage() {
    return (
        <div className="space-y-6">
            <ModelCharts evaluationType="multi_label" />
        </div>
    );
}