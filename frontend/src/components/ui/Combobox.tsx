'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

export type ComboboxOption = { value: string; label: string };

type ComboboxProps = {
  value: string;
  options: ComboboxOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
};

export function Combobox({ value, options, onChange, placeholder = 'Seleccionar…', searchPlaceholder = 'Buscar…', className = '', disabled = false }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);
  const filtered = options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const openList = () => {
    if (disabled) return;
    setOpen(true);
    setQuery('');
    setHighlighted(Math.max(0, filtered.findIndex((option) => option.value === value)));
  };

  const choose = (option: ComboboxOption) => {
    onChange(option.value);
    setOpen(false);
    setQuery('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') { setOpen(false); return; }
    if (event.key === 'Enter') { event.preventDefault(); if (filtered[highlighted]) choose(filtered[highlighted]); return; }
    if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); setHighlighted((current) => Math.min(current + 1, filtered.length - 1)); return; }
    if (event.key === 'ArrowUp') { event.preventDefault(); setHighlighted((current) => Math.max(current - 1, 0)); }
  };

  return (
    <div ref={rootRef} className={`relative mt-2 ${className}`}>
      <div role="combobox" aria-expanded={open} aria-controls={listId} aria-haspopup="listbox" className={`flex items-center border-b border-navy-950/25 bg-transparent focus-within:border-gold-600 ${disabled ? 'opacity-50' : ''}`}>
        <input ref={inputRef} value={open ? query : selected?.label ?? ''} onChange={(event) => { setQuery(event.target.value); setOpen(true); setHighlighted(0); }} onFocus={openList} onKeyDown={handleKeyDown} placeholder={selected ? undefined : placeholder} disabled={disabled} className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none" aria-label={selected?.label ?? placeholder} />
        <button type="button" tabIndex={-1} onClick={() => { if (open) setOpen(false); else { openList(); inputRef.current?.focus(); } }} aria-label={open ? 'Cerrar opciones' : 'Abrir opciones'} disabled={disabled} className="px-1 py-2 text-slate-500 transition hover:text-gold-700">{open ? '⌃' : '⌄'}</button>
      </div>
      {open && <div id={listId} role="listbox" className="absolute z-40 mt-2 max-h-64 w-full overflow-y-auto border border-navy-950/15 bg-white p-1 shadow-xl">
        {filtered.length ? filtered.map((option, index) => <button key={option.value} type="button" role="option" aria-selected={option.value === value} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(option)} className={`block w-full px-3 py-2.5 text-left text-sm transition ${index === highlighted ? 'bg-navy-50 text-navy-950' : 'text-slate-600 hover:bg-paper-100'} ${option.value === value ? 'font-semibold text-gold-700' : ''}`}>{option.label}</button>) : <p className="px-3 py-3 text-sm text-slate-500">{searchPlaceholder}</p>}
      </div>}
    </div>
  );
}