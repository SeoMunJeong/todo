import type { FilterState, FilterStatus, Priority } from '../types';

interface Props {
  filter: FilterState;
  onChange: (f: FilterState) => void;
  allTags: string[];
  counts: { all: number; active: number; completed: number };
}

const STATUS_TABS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'active', label: '진행 중' },
  { key: 'completed', label: '완료' },
];

const PRIORITY_OPTIONS: { key: Priority | 'all'; label: string; dot?: string }[] = [
  { key: 'all', label: '모든 우선순위' },
  { key: 'high', label: '높음', dot: 'bg-red-400' },
  { key: 'medium', label: '중간', dot: 'bg-amber-400' },
  { key: 'low', label: '낮음', dot: 'bg-blue-400' },
];

export default function FilterBar({ filter, onChange, allTags, counts }: Props) {
  function set(partial: Partial<FilterState>) {
    onChange({ ...filter, ...partial });
  }

  return (
    <div className="space-y-3 mb-5">
      {/* Status tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
        {STATUS_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => set({ status: key })}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              filter.status === key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                filter.status === key
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Priority + Tag row */}
      <div className="flex flex-wrap gap-2">
        {/* Search */}
        <div className="flex-1 min-w-[180px] relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={filter.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="검색..."
            className="w-full pl-8 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors"
          />
          {filter.search && (
            <button
              onClick={() => set({ search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Priority filter */}
        <select
          value={filter.priority}
          onChange={(e) => set({ priority: e.target.value as Priority | 'all' })}
          className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-indigo-400 cursor-pointer"
        >
          {PRIORITY_OPTIONS.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <select
            value={filter.tag ?? ''}
            onChange={(e) => set({ tag: e.target.value || null })}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-indigo-400 cursor-pointer"
          >
            <option value="">모든 태그</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
