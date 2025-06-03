// app/managing/graphical/class-pair/page.tsx
'use client';

import ModelCharts from "@/app/ui/admin/graphs/Modelcharts";


export default function ClassPairPage() {
  return (
    <div className="space-y-6">
      <ModelCharts evaluationType="class_pair" />
    </div>
  );
}