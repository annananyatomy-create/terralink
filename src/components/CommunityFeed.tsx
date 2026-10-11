import React, { useState } from 'react';
import { ActivityFeedItem } from '../types';
import { Heart, ThumbsUp, Sprout, Send, MessageSquare } from 'lucide-react';

interface CommunityFeedProps {
  feedItems: ActivityFeedItem[];
  onReact: (itemId: string, reactionType: 'clap' | 'seed' | 'heart') => void;
  onPostUpdate: (message: string) => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  feedItems,
  onReact,
  onPostUpdate,
}) => {
  const [commentInput, setCommentInput] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim()) {
      onPostUpdate(commentInput.trim());
      setCommentInput('');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-700" />
            Shared Climate Action Feed
          </h2>
          <p className="text-xs text-stone-500">
            Real-time neighborhood stream of sustainable choices and mutual cheers
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Live Community
        </span>
      </div>

      {/* Quick Community Broadcast input */}
      <form onSubmit={handlePost} className="flex gap-2">
        <input
          type="text"
          placeholder="Share an eco-tip, community repair win, or group ride..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        />
        <button
          type="submit"
          disabled={!commentInput.trim()}
          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Post</span>
        </button>
      </form>

      {/* Feed Stream */}
      <div className="divide-y divide-stone-100 space-y-3">
        {feedItems.map((item) => (
          <div key={item.id} className="pt-3 first:pt-0">
            <div className="flex items-start gap-3">
              <img
                src={item.userAvatar}
                alt={item.userName}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-stone-900">{item.userName}</span>
                    <span className="text-[11px] text-stone-400 font-mono">
                      · {item.neighborhood}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 whitespace-nowrap">
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                  {item.actionTitle}
                </p>

                {/* Reaction Buttons */}
                <div className="mt-2 flex items-center gap-2">
                  {item.reactions.map((r) => (
                    <button
                      key={r.type}
                      onClick={() => onReact(item.id, r.type)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                        r.userReacted
                          ? 'bg-emerald-100 text-emerald-800 font-semibold'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {r.type === 'clap' && <ThumbsUp className="w-3 h-3 text-emerald-700" />}
                      {r.type === 'seed' && <Sprout className="w-3 h-3 text-teal-700" />}
                      {r.type === 'heart' && <Heart className="w-3 h-3 text-rose-600" />}
                      <span className="font-mono tabular-nums">{r.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
