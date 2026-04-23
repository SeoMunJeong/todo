import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format, isPast, isToday, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Todo, Priority } from '../types';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

const PRIORITY_CONFIG: Record<Priority, { border: string; badge: string; label: string }> = {
  low: {
    border: 'border-l-blue-400',
    badge: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    label: '낮음',
  },
  medium: {
    border: 'border-l-amber-400',
    badge: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    label: '중간',
  },
  high: {
    border: 'border-l-red-400',
    badge: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    label: '높음',
  },
};

function DueDateBadge({ date }: { date: string }) {
  const parsed = parseISO(date);
  const overdue = isPast(parsed) && !isToday(parsed);
  const todayDue = isToday(parsed);
  const label = todayDue ? '오늘' : format(parsed, 'M월 d일', { locale: ko });

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
        overdue
          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          : todayDue
          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
      }`}
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {overdue ? `${label} 초과` : label}
    </span>
  );
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [showActions, setShowActions] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);
  const pc = PRIORITY_CONFIG[todo.priority];

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [editing]);

  function commitEdit() {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      onUpdate(todo.id, { text: trimmed });
    } else {
      setEditText(todo.text);
    }
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setEditing(false);
    }
  }

  function handleDelete() {
    if (deleteConfirm) {
      onDelete(todo.id);
    } else {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 2000);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setDeleteConfirm(false); }}
      className={`group flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 border-l-4 ${pc.border} shadow-sm hover:shadow-md transition-all animate-slide-in ${todo.completed ? 'opacity-60' : ''}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className={`flex-shrink-0 mt-0.5 cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-400 touch-none transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
          todo.completed
            ? 'bg-indigo-500 border-indigo-500'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
        }`}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={editRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="w-full bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg px-2 py-1 text-sm outline-none border border-indigo-300 dark:border-indigo-600"
          />
        ) : (
          <p
            className={`text-sm text-gray-800 dark:text-gray-100 leading-snug cursor-pointer ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}
            onDoubleClick={() => !todo.completed && setEditing(true)}
          >
            {todo.text}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          {/* Priority badge */}
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${pc.badge}`}>
            {pc.label}
          </span>

          {/* Due date */}
          {todo.dueDate && !todo.completed && <DueDateBadge date={todo.dueDate} />}

          {/* Tags */}
          {todo.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
            >
              #{tag}
            </span>
          ))}

          {/* Completed time */}
          {todo.completed && todo.completedAt && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              완료: {format(new Date(todo.completedAt), 'M/d HH:mm')}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className={`flex-shrink-0 flex items-center gap-1 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
        {!todo.completed && (
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            title="편집"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        <button
          onClick={handleDelete}
          className={`p-1.5 rounded-lg transition-colors ${
            deleteConfirm
              ? 'text-white bg-red-500 hover:bg-red-600'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
          title={deleteConfirm ? '한 번 더 클릭하면 삭제' : '삭제'}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
