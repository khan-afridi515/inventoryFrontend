import { Search, Bell } from 'lucide-react';

/**
 * Persistent top bar shown across pages. This is intentionally kept
 * generic (breadcrumb + search + notifications + avatar) rather than
 * Reports-specific, since the design shows it above every page — wire
 * it into your AppLayout once, not per-page.
 *
 * @param {{
 *   breadcrumb: Array<string>,
 *   notificationCount?: number,
 *   userInitials?: string,
 *   onSearch?: (query: string) => void,
 * }} props
 */
export function TopBar({ breadcrumb, notificationCount = 0, userInitials = '', onSearch }) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
      <nav aria-label="Breadcrumb" className="text-sm">
        {breadcrumb.map((crumb, i) => {
          const isLast = i === breadcrumb.length - 1;
          return (
            <span key={crumb}>
              <span className={isLast ? 'font-semibold text-text' : 'text-muted'}>{crumb}</span>
              {!isLast && <span className="mx-1.5 text-muted">/</span>}
            </span>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search size={15} className="pointer-events-none absolute inset-y-0 left-3 my-auto text-muted" />
          <input
            type="search"
            placeholder="Search products, SKUs, orders"
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-64 rounded-md border border-border bg-bg py-1.5 pl-8 pr-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface hover:bg-bg focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <Bell size={15} className="text-text" />
          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-negative text-[10px] font-bold text-white">
              {notificationCount}
            </span>
          )}
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
          {userInitials}
        </div>
      </div>
    </div>
  );
}
