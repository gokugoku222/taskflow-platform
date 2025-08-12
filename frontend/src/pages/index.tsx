import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Por enquanto, redirecionar para uma página simples
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
