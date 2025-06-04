// app/managing/graphical/layout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdKeyboardArrowRight } from "react-icons/md";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Determine active evaluation from pathname
  const getActiveEvaluation = () => {
    if (pathname.includes('multi-label')) return 'multi-label';
    if (pathname.includes('class-pair')) return 'class-pair';
    if (pathname.includes('single-class')) return 'single-class';
    if (pathname.includes('normal-abnormal')) return 'normal-abnormal';
    return 'multi-label'; // default
  };
  const [activeEvaluation, setActiveEvaluation] = useState(getActiveEvaluation());

  const evaluationMethods = [
    { id: 'multi-label', name: 'Multi-label', path: 'multi-label' },
    { id: 'class-pair', name: 'Class Pair', path: 'class-pair' },
    { id: 'single-class', name: 'Single Class', path: 'single-class' },
    { id: 'normal-abnormal', name: 'Normal vs Abnormal', path: 'normal-abnormal' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Evaluation Method Breadcrumbs */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <nav className="flex" aria-label="Evaluation methods">
          <ol className="flex items-center space-x-2">
            {evaluationMethods.map((method, index) => (
              <li key={method.id} className="flex items-center">
                {index > 0 && (
                  <MdKeyboardArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                )}
                <Link
                  href={method.id === 'multi-label'? `/managing/classification` : `/managing/classification/${method.path}`}
                  onClick={() => setActiveEvaluation(method.id)}
                  className={`text-sm font-medium ${activeEvaluation === method.id ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {method.name}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}