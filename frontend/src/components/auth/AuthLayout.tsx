import { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">TaskFlow</h1>
            <h2 className="mt-2 text-xl font-semibold text-gray-700">{title}</h2>
            <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
      
      {/* Compact footer for auth pages */}
      <Footer compact={true} />
    </div>
  );
}
