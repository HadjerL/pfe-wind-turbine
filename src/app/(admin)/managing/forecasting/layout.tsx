// app/tuning/layout.tsx
import ForecastUploader from '@/app/ui/admin/forecast-uploader';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex flex-col min-h-screen">
      <ForecastUploader />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}