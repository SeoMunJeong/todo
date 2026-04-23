import { useState, useEffect, useCallback } from 'react';
import type { Todo, Priority, FilterState } from '../types';

const STORAGE_KEY = 'mj-todos';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Todo[]) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = useCallback(
    (text: string, priority: Priority = 'medium', dueDate: string | null = null, tags: string[] = []) => {
      const todo: Todo = {
        id: generateId(),
        text: text.trim(),
        completed: false,
        priority,
        dueDate,
        tags,
        createdAt: new Date().toISOString(),
        completedAt: null,
      };
      setTodos((prev) => [todo, ...prev]);
    },
    []
  );

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : null,
            }
          : t
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const reorderTodos = useCallback((newOrder: Todo[]) => {
    setTodos(newOrder);
  }, []);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    reorderTodos,
  };
}

export function filterTodos(todos: Todo[], filter: FilterState): Todo[] {
  return todos.filter((todo) => {
    if (filter.status === 'active' && todo.completed) return false;
    if (filter.status === 'completed' && !todo.completed) return false;
    if (filter.priority !== 'all' && todo.priority !== filter.priority) return false;
    if (filter.tag && !todo.tags.includes(filter.tag)) return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      if (!todo.text.toLowerCase().includes(q) && !todo.tags.some((t) => t.toLowerCase().includes(q)))
        return false;
    }
    return true;
  });
}

export function getAllTags(todos: Todo[]): string[] {
  const set = new Set<string>();
  todos.forEach((t) => t.tags.forEach((tag) => set.add(tag)));
  return Array.from(set).sort();
}
