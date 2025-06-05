// app/tuning/layout.tsx
import ModelInfo from '@/app/ui/admin/available-models';
import ForecastUploader from '@/app/ui/admin/forecast-uploader';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex flex-col min-h-screen">
      <ModelInfo models_type='forecasting'/>
      <ForecastUploader />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}