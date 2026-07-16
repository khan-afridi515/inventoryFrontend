import { KpiCard } from './KpiCard';

/**
 * @param {{ kpis: Array<object> }} props
 */
export function KpiGrid({ kpis }) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]"
      role="list"
      aria-label="Key performance indicators"
    >
      {kpis.map((kpi) => (
        <div role="listitem" key={kpi.id}>
          <KpiCard {...kpi} />
        </div>
      ))}
    </div>
  );
}
