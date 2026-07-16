function getGreeting(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * @param {{ userName: string }} props
 */
export function DashboardHeader({ userName }) {
  const greeting = getGreeting(new Date().getHours());

  return (
    <header className="mb-5">
      <h1 className="m-0 mb-1 text-2xl font-bold text-text">
        {greeting}, {userName}
      </h1>
      <p className="m-0 text-sm text-muted">
        Here's what's happening across your inventory today.
      </p>
    </header>
  );
}
