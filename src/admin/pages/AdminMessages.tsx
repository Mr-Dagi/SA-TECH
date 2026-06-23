import React from 'react';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
export default function AdminMessages() {
  const { messages, markMessageRead, deleteMessage } = useData();
  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-8">Messages</h1>

      <div className="bg-secondary rounded-2xl border border-color shadow-sm overflow-hidden">
        <div className="divide-y divide-color">
          {messages.length > 0 ?
          messages.map((msg) =>
          <div
            key={msg.id}
            className={`p-6 transition-colors ${!msg.read ? 'bg-primary/50' : ''}`}>
            
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${!msg.read ? 'bg-accent-orange/20 text-accent-orange' : 'bg-tertiary text-secondary'}`}>
                  
                      {!msg.read ? <Mail size={18} /> : <MailOpen size={18} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {msg.name}
                        {!msg.read &&
                    <span className="text-[10px] bg-accent-orange text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                            New
                          </span>
                    }
                      </h3>
                      <a
                    href={`mailto:${msg.email}`}
                    className="text-sm text-accent-blue hover:underline">
                    
                        {msg.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-tertiary">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                    <div className="flex gap-2">
                      {!msg.read &&
                  <button
                    onClick={() => markMessageRead(msg.id)}
                    className="text-xs bg-primary border border-color px-3 py-1 rounded-lg hover:bg-tertiary transition-colors">
                    
                          Mark Read
                        </button>
                  }
                      <button
                    onClick={() => deleteMessage(msg.id)}
                    className="text-xs text-accent-red bg-red-500/10 px-3 py-1 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-1">
                    
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
          ) :

          <div className="p-12 text-center text-secondary">
              <Mail size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg">No messages found.</p>
            </div>
          }
        </div>
      </div>
    </div>);

}