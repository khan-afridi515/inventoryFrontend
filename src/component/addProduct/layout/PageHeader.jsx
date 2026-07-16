/**
 * Generic page header used by non-dashboard pages (Add Product, etc).
 * DashboardHeader stays separate since it has greeting-specific logic;
 * this one is a plain title/subtitle pair reusable anywhere else.
 *
 * @param {{ title: string, subtitle?: string }} props
 */
export function PageHeader({ title, subtitle }) {
  return (
    <header className="mb-5">
      <h1 className="m-0 mb-1 text-2xl font-bold text-text">{title}</h1>
      {subtitle && <p className="m-0 text-sm font-medium text-primary/70">{subtitle}</p>}
    </header>
  );
}
