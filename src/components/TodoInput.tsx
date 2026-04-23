import { useState, useRef, type KeyboardEvent } from 'react';
import type { Priority } from '../types';

interface Props {
  onAdd: (text: string, priority: Priority, dueDate: string | null, tags: string[]) => void;
}

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; dot: string }> = {
  low: { label: '낮음', color: 'text-blue-500', dot: 'bg-blue-400' },
  medium: { label: '중간', color: 'text-amber-500', dot: 'bg-amber-400' },
  high: { label: '높음', color: 'text-red-500', dot: 'bg-red-400' },
};

export default function TodoInput({ onAdd }: Props) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority, dueDate || null, tags);
    setText('');
    setPriority('medium');
    setDueDate('');
    setTagInput('');
    setTags([]);
    setExpanded(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setExpanded(false);
    }
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().replace(/,/g, '');
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
      }
      setTagInput('');
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6 animate-fade-in">
      {/* Main input row */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
          title="추가"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (e.target.value && !expanded) setExpanded(true);
          }}
          onFocus={() => setExpanded(true)}
          onKeyDown={handleKeyDown}
          placeholder="할 일을 입력하세요... (Enter로 추가)"
          className="flex-1 bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base outline-none"
        />
        {text && (
          <button
            onClick={handleSubmit}
            className="flex-shrink-0 px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            추가
          </button>
        )}
      </div>

      {/* Expanded options */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3 animate-fade-in">
          {/* Priority + Due Date row */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Priority selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">우선순위:</span>
              <div className="flex gap-1">
                {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      priority === p
                        ? `border-current ${PRIORITY_CONFIG[p].color} bg-current/10`
                        : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_CONFIG[p].dot}`} />
                    {PRIORITY_CONFIG[p].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Due date */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">마감일:</span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="text-xs bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 outline-none focus:border-indigo-400 cursor-pointer"
              />
              {dueDate && (
                <button onClick={() => setDueDate('')} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-start gap-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">태그:</span>
            <div className="flex flex-wrap gap-1.5 flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg px-2 py-1.5 border border-gray-200 dark:border-gray-600 focus-within:border-indigo-400 min-h-[32px]">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded text-xs"
                >
                  #{tag}
                  <button
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="hover:text-indigo-900 dark:hover:text-indigo-100"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? 'Enter나 ,로 태그 추가' : ''}
                className="flex-1 bg-transparent text-xs text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none min-w-[120px]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
