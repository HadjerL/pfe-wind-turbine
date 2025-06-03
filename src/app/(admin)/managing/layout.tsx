// app/tuning/layout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Uploader from "@/app/ui/admin/uploader";
import { GoGraph } from "react-icons/go";
import { CiViewTable } from "react-icons/ci";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname.includes('datatables') ? 'datatables' : 'graphical');

  return (
    <div className="flex flex-col min-h-screen">
      <Uploader />
      
      <div className="flex border-b border-gray-200 px-8">
        <button
          onClick={() => setActiveTab('graphical')}
          className={`px-4 py-2 font-medium ${activeTab === 'graphical' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          <Link href="/managing" className='flex items-center gap-2'>
            <p>Graphical View</p>
            <GoGraph className='text-lg'/>
          </Link>
        </button>
        <button
          onClick={() => setActiveTab('datatables')}
          className={`px-4 py-2 font-medium ${activeTab === 'datatables' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          <Link href="/managing/datatables" className='flex items-center gap-2'>
          <p>Data Tables</p>
          <CiViewTable className='text-lg'/>
          </Link>
        </button>
      </div>

      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}