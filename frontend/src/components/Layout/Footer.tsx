import React from 'react';

interface FooterProps {
  compact?: boolean;
}

export function Footer({ compact = false }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  if (compact) {
    // Versão compacta para páginas de auth
    return (
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex flex-col items-center space-y-2">
              <div className="text-sm text-gray-600">
                Built with ❤️ by{' '}
                <a 
                  href="https://github.com/MJ-Sarabando" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Maria Sarabando
                </a>
              </div>
              
              <div className="text-sm text-gray-500">
                © {currentYear} Maria Sarabando. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Versão completa para dashboard
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-bold text-primary-600">TaskFlow</h3>
              <span className="text-sm text-gray-500">Enterprise Task Management</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <div className="text-sm text-gray-600">
                Built with ❤️ by{' '}
                <a 
                  href="https://github.com/MJ-Sarabando" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Maria Sarabando
                </a>
              </div>
              
              <div className="text-sm text-gray-500">
                © {currentYear} Maria Sarabando. All rights reserved.
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
              <div className="flex space-x-6 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-700">Privacy Policy</a>
                <a href="#" className="hover:text-gray-700">Terms of Service</a>
                <a href="https://github.com/MJ-Sarabando/taskflow-platform" className="hover:text-gray-700">
                  GitHub
                </a>
              </div>
              
              <div className="text-xs text-gray-400">
                Next.js • TypeScript • Tailwind CSS • PostgreSQL
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
