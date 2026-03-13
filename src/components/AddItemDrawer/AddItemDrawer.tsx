'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X, Star } from 'lucide-react';
import { MediaItem, MediaType, MediaStatus } from '@/types';
import { addItem, updateItem, deleteItem } from '@/data/api';
import styles from './AddItemDrawer.module.css';

interface AddItemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
  itemToEdit?: MediaItem | null;
}

interface FormState {
  type: MediaType;
  title: string;
  author: string;
  director: string;
  year: string;
  genre: string;
  status: MediaStatus;
  rating: number;
  notes: string;
  coverUrl: string;
}

function defaultType(pathname: string): MediaType {
  if (pathname === '/books') return 'book';
  if (pathname === '/films') return 'film';
  return 'book';
}

function emptyForm(type: MediaType): FormState {
  return { type, title: '', author: '', director: '', year: '', genre: '', status: 'want', rating: 0, notes: '', coverUrl: '' };
}

function itemToForm(item: MediaItem): FormState {
  return {
    type: item.type,
    title: item.title,
    author: item.author ?? '',
    director: item.director ?? '',
    year: item.year?.toString() ?? '',
    genre: item.genre ?? '',
    status: item.status,
    rating: item.rating ?? 0,
    notes: item.notes ?? '',
    coverUrl: item.coverUrl ?? '',
  };
}

export function AddItemDrawer({ isOpen, onClose, onAdded, itemToEdit }: AddItemDrawerProps) {
  const pathname = usePathname();
  const isEditing = !!itemToEdit;
  const [form, setForm] = useState<FormState>(() => emptyForm(defaultType(pathname)));
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setForm(itemToEdit ? itemToForm(itemToEdit) : emptyForm(defaultType(pathname)));
      setError('');
      setConfirmDelete(false);
      setSubmitting(false);
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [isOpen, pathname, itemToEdit]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }

    const payload = {
      type: form.type,
      title: form.title.trim(),
      author: form.type === 'book' ? form.author.trim() || undefined : undefined,
      director: form.type === 'film' ? form.director.trim() || undefined : undefined,
      year: form.year ? parseInt(form.year, 10) : undefined,
      genre: form.genre.trim() || undefined,
      status: form.status,
      rating: form.status === 'completed' && form.rating > 0 ? form.rating : undefined,
      notes: form.notes.trim() || undefined,
      coverUrl: form.coverUrl.trim() || undefined,
      dateCompleted: form.status === 'completed' ? new Date().toISOString() : undefined,
    };

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateItem(itemToEdit.id, payload);
      } else {
        await addItem(payload);
      }
      onAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!itemToEdit) return;
    setSubmitting(true);
    try {
      await deleteItem(itemToEdit.id);
      onAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete.');
      setSubmitting(false);
    }
  }

  const drawerTitle = isEditing
    ? `Edit ${form.type === 'book' ? 'Book' : 'Film'}`
    : 'Add Item';

  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={drawerTitle}
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
      >
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>{drawerTitle}</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close drawer">
            <X className={styles.closeIcon} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fields}>
            <div className={styles.typeToggle}>
              {(['book', 'film'] as MediaType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set('type', t)}
                  className={`${styles.toggleButton} ${form.type === t ? styles.toggleButtonActive : ''}`}
                >
                  {t === 'book' ? 'Book' : 'Film'}
                </button>
              ))}
            </div>

            <Field label="Title *" styles={styles}>
              <input
                ref={firstInputRef}
                type="text"
                value={form.title}
                onChange={(e) => { set('title', e.target.value); setError(''); }}
                placeholder="Enter title"
                className={styles.input}
              />
              {error && <p className={styles.errorText}>{error}</p>}
            </Field>

            {form.type === 'book' ? (
              <Field label="Author" styles={styles}>
                <input type="text" value={form.author} onChange={(e) => set('author', e.target.value)} placeholder="Author name" className={styles.input} />
              </Field>
            ) : (
              <Field label="Director" styles={styles}>
                <input type="text" value={form.director} onChange={(e) => set('director', e.target.value)} placeholder="Director name" className={styles.input} />
              </Field>
            )}

            <div className={styles.row}>
              <Field label="Year" styles={styles}>
                <input type="number" value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="e.g. 2024" min="1800" max="2100" className={styles.input} />
              </Field>
              <Field label="Genre" styles={styles}>
                <input type="text" value={form.genre} onChange={(e) => set('genre', e.target.value)} placeholder="e.g. Fiction" className={styles.input} />
              </Field>
            </div>

            <Field label="Status" styles={styles}>
              <div className={styles.statusToggle}>
                {([
                  { value: 'want', label: 'Want to Read/Watch' },
                  { value: 'completed', label: 'Completed' },
                ] as { value: MediaStatus; label: string }[]).map(({ value, label }) => (
                  <button key={value} type="button" onClick={() => set('status', value)} className={`${styles.toggleButton} ${form.status === value ? styles.toggleButtonActive : ''}`}>
                    {label}
                  </button>
                ))}
              </div>
            </Field>

            {form.status === 'completed' && (
              <Field label="Rating" styles={styles}>
                <StarRating value={form.rating} onChange={(r) => set('rating', r)} styles={styles} />
              </Field>
            )}

            <Field label="Notes" styles={styles}>
              <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Any thoughts..." rows={3} className={styles.textarea} />
            </Field>

            <Field label="Cover URL" styles={styles}>
              <input type="url" value={form.coverUrl} onChange={(e) => set('coverUrl', e.target.value)} placeholder="https://..." className={styles.input} />
            </Field>
          </div>

          <div className={styles.footer}>
            {isEditing && (
              confirmDelete ? (
                <div className={styles.confirmDelete}>
                  <p className={styles.confirmText}>Delete this {form.type}?</p>
                  <div className={styles.confirmButtons}>
                    <button type="button" onClick={() => setConfirmDelete(false)} className={styles.cancelButton}>Cancel</button>
                    <button type="button" onClick={handleDelete} className={styles.deleteButton}>Delete</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className={styles.deleteItemButton}>
                  Delete {form.type === 'book' ? 'Book' : 'Film'}
                </button>
              )
            )}
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? 'Saving…' : (isEditing ? 'Save Changes' : `Add ${form.type === 'book' ? 'Book' : 'Film'}`)}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}

function Field({ label, children, styles }: { label: string; children: React.ReactNode; styles: Record<string, string> }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      {children}
    </div>
  );
}

function StarRating({ value, onChange, styles }: { value: number; onChange: (r: number) => void; styles: Record<string, string> }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => {
        const star = i + 1;
        const filled = star <= (hovered || value);
        return (
          <button key={star} type="button" onClick={() => onChange(star)} onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} aria-label={`Rate ${star} out of 5`} className={styles.starButton}>
            <Star className={`${styles.starIcon} ${filled ? styles.starIconFilled : ''}`} />
          </button>
        );
      })}
    </div>
  );
}
