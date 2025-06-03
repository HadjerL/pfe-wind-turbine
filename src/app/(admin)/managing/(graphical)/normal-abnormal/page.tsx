// app/managing/graphical/normal-abnormal/page.tsx
'use client';

import ModelCharts from "@/app/ui/admin/graphs/Modelcharts";

export default function NormalAbnormalPage() {
  return (
    <div className="space-y-6">
      <ModelCharts evaluationType="normal_abnormal" />
    </div>
  );
}