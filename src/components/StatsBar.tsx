import type { Todo } from '../types';

interface Props {
  todos: Todo[];
}

export default function StatsBar({ todos }: Props) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const high = todos.filter((t) => t.priority === 'high' && !t.completed).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  if (total === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-6 shadow-sm">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">전체 진행률</span>
        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="전체" value={total} color="text-gray-700 dark:text-gray-200" bg="bg-gray-50 dark:bg-gray-700/50" />
        <StatCard label="진행 중" value={active} color="text-indigo-600 dark:text-indigo-400" bg="bg-indigo-50 dark:bg-indigo-900/20" />
        <StatCard label="완료" value={completed} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-900/20" />
        <StatCard label="긴급" value={high} color="text-red-600 dark:text-red-400" bg="bg-red-50 dark:bg-red-900/20" />
      </div>
    </div>
  );
}

function StatCard({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className={`${bg} rounded-xl p-3 text-center`}>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}
