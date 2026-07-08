import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyConversations, getUnreadCount } from '../../api/messageApi';
import { MessageCircle, Users } from 'lucide-react';

const ConversationsList = () => {
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await getMyConversations();
      setConversations(data);
    } catch (err) {
      setError('Failed to load conversations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const getOtherParticipant = (conversation) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return conversation.participants.find(p => p._id !== user._id);
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading conversations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              {unreadCount} unread
            </span>
          )}
        </div>

        {conversations.length === 0 ? (
          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-12 text-center">
            <MessageCircle className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No conversations yet</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Start a conversation by visiting a product or service profile and clicking "Message Seller" or "Message Provider" to connect with the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="inline-flex items-center bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
                Browse Products
              </Link>
              <Link to="/services" className="inline-flex items-center bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-6 py-2.5 rounded-xl font-medium transition-colors">
                Browse Services
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {conversations.map((conversation) => {
              const otherUser = getOtherParticipant(conversation);
              return (
                <Link
                  key={conversation._id}
                  to={`/chat/${conversation._id}`}
                  className="block border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                      {otherUser?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {otherUser?.name || 'Unknown User'}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage?.text || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
