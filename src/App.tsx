import { useState } from 'react';
import type { FilterState } from './types';
import { useTodos, filterTodos, getAllTags } from './hooks/useTodos';
import { useDarkMode } from './hooks/useDarkMode';
import TodoInput from './components/TodoInput';
import FilterBar from './components/FilterBar';
import TodoList from './components/TodoList';
import StatsBar from './components/StatsBar';

const DEFAULT_FILTER: FilterState = {
  status: 'all',
  priority: 'all',
  tag: null,
  search: '',
};

export default function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo, clearCompleted, reorderTodos } = useTodos();
  const { dark, toggle: toggleDark } = useDarkMode();
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);

  const filteredTodos = filterTodos(todos, filter);
  const allTags = getAllTags(todos);
  const completedCount = todos.filter((t) => t.completed).length;

  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: completedCount,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              나의 할 일
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </p>
          </div>
          <button
            onClick={toggleDark}
            className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition-all"
            title={dark ? '라이트 모드' : '다크 모드'}
          >
            {dark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </header>

        {/* Stats */}
        <StatsBar todos={todos} />

        {/* Input */}
        <TodoInput onAdd={addTodo} />

        {/* Filters */}
        <FilterBar
          filter={filter}
          onChange={setFilter}
          allTags={allTags}
          counts={counts}
        />

        {/* List */}
        <TodoList
          todos={todos}
          filteredTodos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
          onReorder={reorderTodos}
          onClearCompleted={clearCompleted}
          completedCount={completedCount}
        />
      </div>
    </div>
  );
}
