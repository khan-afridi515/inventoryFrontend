/**
 * Page-level layout shell. Keeps page structure (grid/spacing) separate
 * from the content components themselves.
 */
export function DashboardLayout({ header, kpis, charts, secondary }) {
  return (
    <div className="mx-auto max-w-[1440px] p-6">
      {header}
      <div className="mb-4">{kpis}</div>
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">{charts}</div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{secondary}</div>
    </div>
  );
}
