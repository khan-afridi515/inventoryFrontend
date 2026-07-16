import { TREND_DIRECTION } from '../constants/dashboard.constants';

/**
 * Derives display-ready trend info (arrow direction, color tone, label)
 * from a raw kpi.trend object, so KpiCard stays purely presentational.
 * @param {{ value: number, direction: 'up'|'down', label: string } | undefined} trend
 */
export function useKpiTrend(trend) {
  if (!trend) return null;

  const direction = trend.direction ?? TREND_DIRECTION.FLAT;
  const isUp = direction === TREND_DIRECTION.UP;
  const isDown = direction === TREND_DIRECTION.DOWN;

  return {
    arrow: isUp ? '↗' : isDown ? '↘' : '→',
    tone: isUp ? 'positive' : isDown ? 'negative' : 'neutral',
    text: `${trend.value}% ${trend.label}`,
  };
}
