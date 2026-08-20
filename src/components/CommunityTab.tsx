import React, { useState } from 'react';
import { Users, Heart, MessageSquare, Share2, Trophy, Flame, Send, Plus, Check } from 'lucide-react';
import { SocialPost, LeaderboardUser } from '../types';
import { MOCK_LEADERBOARD } from '../data/mockData';

interface CommunityTabProps {
  posts: SocialPost[];
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenQuickLog: () => void;
}

export const CommunityTab: React.FC<CommunityTabProps> = ({
  posts,
  onLikePost,
  onAddComment,
  onOpenQuickLog
}) => {
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [activeShareModal, setActiveShareModal] = useState(false);

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (text && text.trim()) {
      onAddComment(postId, text.trim());
      setCommentInputs({ ...commentInputs, [postId]: '' });
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Users className="h-7 w-7 text-orange-400" />
            <span>Community Feed & Motivation</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Share your workouts, cheer on friends, and climb the weekly leaderboard.
          </p>
        </div>
        <button
          onClick={onOpenQuickLog}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-orange-500/25 transition transform hover:scale-105 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Share Workout / Post</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              {/* Author Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="h-11 w-11 rounded-full object-cover border-2 border-orange-500/40"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{post.author}</h4>
                    <span className="text-xs text-slate-400">{post.time}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    {post.workoutType}
                  </span>
                  <span className="text-xs font-medium text-slate-300 bg-slate-800 px-2.5 py-1 rounded-full">
                    {post.duration} • {post.calories}
                  </span>
                </div>
              </div>

              {/* Content */}
              <p className="text-slate-200 text-sm leading-relaxed">{post.content}</p>

              {/* Optional Post Image */}
              {post.image && (
                <div className="rounded-2xl overflow-hidden border border-slate-800">
                  <img src={post.image} alt="Workout post" className="w-full h-64 object-cover" referrerPolicy="no-referrer" />
                </div>
              )}

              {/* Likes & Comments bar */}
              <div className="flex items-center space-x-6 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onLikePost(post.id)}
                  className="flex items-center space-x-1.5 text-slate-300 hover:text-red-400 text-sm font-medium transition group"
                >
                  <Heart className="h-5 w-5 text-red-500 group-hover:scale-110 transition" />
                  <span>{post.likes} Likes</span>
                </button>
                <div className="flex items-center space-x-1.5 text-slate-300 text-sm font-medium">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                  <span>{post.comments.length} Comments</span>
                </div>
              </div>

              {/* Comments Section */}
              {post.comments.length > 0 && (
                <div className="space-y-2 pt-2 bg-slate-950/40 p-3 rounded-2xl border border-slate-800">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-orange-400">{comment.author}</span>
                        <span className="text-[10px] text-slate-400">{comment.time}</span>
                      </div>
                      <p className="text-slate-300">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Input */}
              <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  placeholder="Cheer on your peer..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-xl transition"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          ))}
        </div>

        {/* Leaderboard Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 h-fit">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              <span>Weekly Leaderboard</span>
            </h3>
            <span className="text-xs font-medium text-slate-400">Steps & Streaks</span>
          </div>

          <div className="space-y-3">
            {MOCK_LEADERBOARD.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                  user.name.includes('You')
                    ? 'bg-orange-500/10 border-orange-500/30'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    user.rank === 1 ? 'bg-amber-500 text-slate-950' :
                    user.rank === 2 ? 'bg-slate-300 text-slate-950' :
                    user.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {user.rank}
                  </span>
                  <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <h5 className="text-xs font-bold text-white">{user.name}</h5>
                    <span className="text-[10px] text-slate-400">{user.weeklySteps.toLocaleString()} steps</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                    {user.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 rounded-2xl p-4 text-center">
            <h4 className="text-xs font-bold text-orange-400 mb-1">Want to climb higher?</h4>
            <p className="text-[11px] text-slate-300">Complete daily workout challenges and log your steps to boost your rank!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
