import { useEffect } from 'react';

export default function Home({ setActiveTab }) {
  useEffect(() => {
    if (setActiveTab) setActiveTab('dashboard');
  }, [setActiveTab]);

  return (
    <div>
      <h2 className="text-xl font-bold">Welcome to your Dashboard</h2>
      <p className="text-slate-500 mt-2">This is the main home overview screen.</p>
    </div>
  );
}