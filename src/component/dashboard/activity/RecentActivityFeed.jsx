import { Panel } from '../common/Panel';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatShortDate } from '../../../utils/formatDate';
import { sanitizeText } from '../../../utils/sanitize';
import styles from './RecentActivityFeed.module.css';

/**
 * @param {{ activity: Array<{ id: string, text: string, timestamp: string, amount: number }> }} props
 */
export function RecentActivityFeed({ activity }) {
  return (
    <Panel title="Recent Activity">
      <ul className={`m-0 max-h-65 list-none overflow-y-auto p-0 ${styles.scrollArea}`}>
        {activity.map((item) => (
          <li
            className="flex gap-2.5 border-b border-border py-2.5 last:border-none"
            key={item.id}
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <div>
              <p className="m-0 text-[13px] font-semibold text-text">{sanitizeText(item.text)}</p>
              <p className="m-0.5 mt-0 text-xs text-muted">
                {formatShortDate(item.timestamp)} · {formatCurrency(item.amount)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
