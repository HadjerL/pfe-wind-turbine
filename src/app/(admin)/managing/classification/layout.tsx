// app/tuning/layout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Uploader from "@/app/ui/admin/uploader";
import { GoGraph } from "react-icons/go";
import { CiViewTable } from "react-icons/ci";
import AvailableModels from '@/app/ui/admin/available-models';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname.includes('datatables') ? 'datatables' : 'graphical');

  return (
    <div className="flex flex-col min-h-screen">
      <AvailableModels models_type='classification' />
      <Uploader />
      
      <div className="flex border-b border-gray-200 px-8">
        <button
          onClick={() => setActiveTab('graphical')}
          className={`px-4 py-2 font-medium ${activeTab === 'graphical' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          <Link href="/managing/classification" className='flex items-center gap-2'>
            <p>Graphical View</p>
            <GoGraph className='text-lg'/>
          </Link>
        </button>
        <button
          onClick={() => setActiveTab('datatables')}
          className={`px-4 py-2 font-medium ${activeTab === 'datatables' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          <Link href="/managing/classification/datatables" className='flex items-center gap-2'>
          <p>Classification reports</p>
          <CiViewTable className='text-lg'/>
          </Link>
        </button>
      </div>

      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}