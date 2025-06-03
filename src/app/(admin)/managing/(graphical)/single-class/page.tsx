// app/managing/graphical/single-class/page.tsx
'use client';

import ModelCharts from "@/app/ui/admin/graphs/Modelcharts";

export default function SingleClassPage() {
  return (
    <div className="space-y-6">
      <ModelCharts evaluationType="single_class" />
    </div>
  );
}