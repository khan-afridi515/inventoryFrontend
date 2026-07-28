import React from 'react';

function getGreeting(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * @param {{ userName?: string, title?: string }} props
 */
export function DashboardHeader({ userName, title }) {
  const greeting = getGreeting(new Date().getHours());
  
  // Uses the title prop if passed, otherwise builds "Good morning, [User Name]"
  const headerTitle = title || `${greeting}${userName ? `, ${userName}` : ''}`;

  return (
    <header className="mb-5">
      <h1 className="truncate text-[30px] m-0 mb-1 font-black text-text">
        {headerTitle}
      </h1>

      <p className="m-0 text-sm text-muted">
        Here's what's happening across your inventory today.
      </p>
    </header>
  );
}