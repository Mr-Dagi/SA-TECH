import { useMemo, useState } from 'react';
import { Mail, MailOpen, Trash2, CheckCheck, Reply, MailCheck } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
import { DataState } from '../../shared/components/ui/DataState';

export default function AdminMessages() {
  const { messages, markMessageRead, deleteMessage, markAllMessagesRead, isLoading, error } = useData();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const hasUnread = useMemo(() => messages.some((m) => !m.read), [messages]);
  const allSelected = messages.length > 0 && selectedIds.size === messages.length;
  const someSelected = selectedIds.size > 0;

  const dataState = <DataState isLoading={isLoading} error={error} />;
  if (isLoading || error) return dataState;

  const toggleSelect = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(messages.map((m) => m.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Delete ${selectedIds.size} selected message(s)? This cannot be undone.`)) return;
    for (const id of Array.from(selectedIds)) {
      await deleteMessage(id);
    }
    setSelectedIds(new Set());
  };

  const buildMailto = (email: string, name: string, originalMessage: string) => {
    const subject = encodeURIComponent(`Re: Your message to SA-Tech Startup`);
    const body = encodeURIComponent(
      `Hi ${name},\n\nThank you for reaching out to SA-Tech Startup. Following up on your message:\n\n> ${originalMessage}\n\nBest regards,\nSA-Tech Startup`
    );
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">Messages</h1>
        <div className="flex flex-wrap gap-2">
          {someSelected && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-accent-red/30 bg-accent-red/10 px-4 py-2 text-sm font-medium text-accent-red transition hover:bg-accent-red/20"
            >
              <Trash2 size={16} /> Delete selected ({selectedIds.size})
            </button>
          )}
          {hasUnread && (
            <button
              onClick={() => markAllMessagesRead()}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-color bg-primary px-4 py-2 text-sm font-medium text-secondary transition hover:bg-tertiary"
            >
              <CheckCheck size={16} /> Mark All as Read
            </button>
          )}
        </div>
      </div>

      <div className="bg-secondary rounded-2xl border border-color shadow-sm overflow-hidden">
        {messages.length > 0 && (
          <div className="flex items-center gap-3 border-b border-color bg-tertiary/40 px-6 py-3 text-sm text-secondary">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4"
                aria-label="Select all messages"
              />
              <span className="font-medium">
                {allSelected ? 'Deselect all' : 'Select all'}
              </span>
            </label>
            {someSelected && (
              <span className="text-xs text-accent-blue">
                {selectedIds.size} selected
              </span>
            )}
          </div>
        )}
        <div className="divide-y divide-color">
          {messages.length > 0 ? (
            messages.map((msg) => {
              const isSelected = selectedIds.has(msg.id);
              return (
                <div
                  key={msg.id}
                  className={`p-6 transition-colors ${!msg.read ? 'bg-primary/50' : ''} ${
                    isSelected ? 'ring-1 ring-accent-blue/40' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-4 gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(msg.id)}
                        className="w-4 h-4 flex-shrink-0"
                        aria-label={`Select message from ${msg.name}`}
                      />
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          !msg.read ? 'bg-accent-orange/20 text-accent-orange' : 'bg-tertiary text-secondary'
                        }`}
                      >
                        {!msg.read ? <Mail size={18} /> : <MailOpen size={18} />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg flex items-center gap-2 flex-wrap">
                          <span className="truncate">{msg.name}</span>
                          {!msg.read && (
                            <span className="text-[10px] bg-accent-orange text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                              New
                            </span>
                          )}
                        </h3>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-sm text-accent-blue hover:underline truncate block"
                        >
                          {msg.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-sm text-tertiary">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                      <div className="flex gap-2 flex-wrap justify-end">
                        <a
                          href={buildMailto(msg.email, msg.name, msg.message)}
                          className="text-xs bg-primary border border-color px-3 py-1 rounded-lg hover:bg-tertiary transition-colors flex items-center gap-1"
                        >
                          <Reply size={12} /> Reply
                        </a>
                        {!msg.read && (
                          <button
                            onClick={() => markMessageRead(msg.id)}
                            className="text-xs bg-primary border border-color px-3 py-1 rounded-lg hover:bg-tertiary transition-colors flex items-center gap-1"
                          >
                            <MailCheck size={12} /> Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => setPendingDeleteId(msg.id)}
                          className="text-xs text-accent-red bg-red-500/10 px-3 py-1 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary p-4 rounded-xl border border-color">
                    <p className="text-secondary whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-secondary">
              <Mail size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg">No messages found.</p>
            </div>
          )}
        </div>
      </div>
      {pendingDeleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-color bg-secondary p-6 shadow-2xl">
            <h3 className="text-xl font-bold">Delete message?</h3>
            <p className="mt-3 text-sm text-secondary">Are you sure you want to delete this message? This cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setPendingDeleteId(null)} className="rounded-lg border border-color px-4 py-2 text-sm">
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteMessage(pendingDeleteId);
                  setPendingDeleteId(null);
                }}
                className="rounded-lg bg-accent-red px-4 py-2 text-sm font-medium text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
