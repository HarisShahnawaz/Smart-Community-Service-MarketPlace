import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getMyConversations,
  getMessages,
  sendMessage,
  getUnreadCount,
} from '../../api/messageApi';
import { useSocket } from '../../context/SocketContext';
import {
  ArrowLeft,
  Send,
  MessageCircle,
  Search,
  MoreVertical,
  Check,
  CheckCheck,
  Smile,
  Paperclip,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────── */
const currentUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

const formatConvTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  if (diff < 604800000) {
    return d.toLocaleDateString([], { weekday: 'short' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const formatMsgTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getDateLabel = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

/* ─────────────────────────────────────────────────────
   AVATAR
───────────────────────────────────────────────────── */
const Avatar = ({ name, size = 'md', online = false }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };
  const letter = name?.charAt(0).toUpperCase() || '?';
  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sizes[size]} rounded-full bg-gradient-to-br from-brand-500 to-brand-700 dark:from-dark-brand dark:to-teal-700 flex items-center justify-center text-white font-semibold shadow-sm`}
      >
        {letter}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-white dark:border-dark-surface" />
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   CONVERSATION LIST ITEM
───────────────────────────────────────────────────── */
const ConvItem = ({ conv, active, currentUser, onClick }) => {
  const other = conv.participants?.find((p) => p._id !== currentUser?._id);
  const lastMsg = conv.lastMessage?.text || 'No messages yet';
  const time = formatConvTime(conv.lastMessageAt);
  const unread = conv.unreadCount || 0;

  return (
    <button
      onClick={() => onClick(conv._id)}
      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-100 dark:border-dark-border last:border-0 ${
        active
          ? 'bg-brand-50 dark:bg-dark-surface-elevated'
          : 'hover:bg-gray-50 dark:hover:bg-dark-surface-elevated'
      }`}
    >
      <Avatar name={other?.name} size="lg" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`font-semibold truncate text-sm ${
              active
                ? 'text-brand-700 dark:text-dark-brand'
                : 'text-gray-900 dark:text-dark-text-primary'
            }`}
          >
            {other?.name || 'Unknown User'}
          </span>
          <span className="text-[11px] text-gray-400 dark:text-dark-text-secondary flex-shrink-0">
            {time}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs text-gray-500 dark:text-dark-text-secondary truncate">
            {lastMsg}
          </p>
          {unread > 0 && (
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-600 dark:bg-dark-brand text-white text-[10px] font-bold flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

/* ─────────────────────────────────────────────────────
   MESSAGE BUBBLE
───────────────────────────────────────────────────── */
const Bubble = ({ message, isOwn, showAvatar, senderName, isFirst, isLast }) => {
  const time = formatMsgTime(message.createdAt);

  return (
    <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar placeholder to keep alignment */}
      <div className="w-7 flex-shrink-0">
        {!isOwn && showAvatar && (
          <Avatar name={senderName} size="sm" />
        )}
      </div>

      <div className={`flex flex-col max-w-[70%] md:max-w-[60%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && isFirst && (
          <span className="text-[11px] font-semibold text-brand-600 dark:text-dark-brand mb-1 ml-1">
            {senderName}
          </span>
        )}
        <div
          className={`relative px-3.5 py-2 text-sm leading-relaxed break-words shadow-sm ${
            isOwn
              ? `bg-brand-600 dark:bg-dark-brand text-white
                 ${isFirst && isLast ? 'rounded-2xl' : isFirst ? 'rounded-t-2xl rounded-bl-2xl rounded-br-sm' : isLast ? 'rounded-b-2xl rounded-tl-2xl rounded-tr-sm' : 'rounded-l-2xl rounded-r-sm'}`
              : `bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text-primary border border-gray-100 dark:border-dark-border
                 ${isFirst && isLast ? 'rounded-2xl' : isFirst ? 'rounded-t-2xl rounded-br-2xl rounded-bl-sm' : isLast ? 'rounded-b-2xl rounded-tr-2xl rounded-tl-sm' : 'rounded-r-2xl rounded-l-sm'}`
          }`}
        >
          {message.text}
        </div>
        {isLast && (
          <span className="text-[10px] text-gray-400 dark:text-dark-text-secondary mt-1 mx-1 flex items-center gap-1">
            {time}
            {isOwn && <CheckCheck className="w-3 h-3 text-brand-400 dark:text-dark-brand" />}
          </span>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   DATE SEPARATOR
───────────────────────────────────────────────────── */
const DateSeparator = ({ date }) => (
  <div className="flex items-center justify-center my-3">
    <span className="bg-gray-200 dark:bg-dark-surface-elevated text-gray-500 dark:text-dark-text-secondary text-[11px] font-medium px-3 py-1 rounded-full">
      {getDateLabel(date)}
    </span>
  </div>
);

/* ─────────────────────────────────────────────────────
   CHAT PANEL (right side - active conversation)
───────────────────────────────────────────────────── */
const ChatPanel = ({ conversationId, conversations, onBack }) => {
  const socket = useSocket();
  const currentUser = currentUserFromStorage();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Derive otherUser from the conversations list first (instant, no extra fetch)
  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conv = conversations.find((c) => c._id === conversationId);
      if (conv) {
        const other = conv.participants?.find((p) => p._id !== currentUser?._id);
        if (other) setOtherUser(other);
      }
    }
  }, [conversationId, conversations]);

  useEffect(() => {
    if (!conversationId) return;
    fetchMessages();
    joinConversation();
    return () => leaveConversation();
  }, [conversationId]);

  useEffect(() => {
    if (!socket?.current) return;
    const s = socket.current;

    const onMsg = (message) => setMessages((prev) => [...prev, message]);
    const onTyping = (data) => {
      if (data.userId !== currentUser?._id) setTypingUser(data.name);
    };
    const onStopTyping = (data) => {
      if (data.userId !== currentUser?._id) setTypingUser(null);
    };

    s.on('receive_message', onMsg);
    s.on('user_typing', onTyping);
    s.on('user_stop_typing', onStopTyping);

    return () => {
      s.off('receive_message', onMsg);
      s.off('user_typing', onTyping);
      s.off('user_stop_typing', onStopTyping);
    };
  }, [socket, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setMessages([]);
      const data = await getMessages(conversationId);
      setMessages(data);
      // Fallback: extract other user from messages
      if (data.length > 0 && !otherUser) {
        const other = data.find((m) => m.sender._id !== currentUser?._id)?.sender;
        if (other) setOtherUser(other);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const joinConversation = () => socket?.current?.emit('join_conversation', conversationId);
  const leaveConversation = () => socket?.current?.emit('leave_conversation', conversationId);

  const handleSend = async (e) => {
    e?.preventDefault();
    const text = newMessage.trim();
    if (!text || sending) return;

    setNewMessage('');
    setSending(true);
    try {
      const message = await sendMessage(conversationId, text);
      setMessages((prev) => [...prev, message]);
      socket?.current?.emit('send_message', { conversationId, message });
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = () => {
    socket?.current?.emit('typing', {
      conversationId,
      userId: currentUser?._id,
      name: currentUser?.name,
    });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket?.current?.emit('stop_typing', {
        conversationId,
        userId: currentUser?._id,
        name: currentUser?.name,
      });
    }, 1500);
  };

  // Group messages for bubble rendering
  const groupedMessages = [];
  let prevDate = null;
  let prevSenderId = null;

  messages.forEach((msg, i) => {
    const msgDate = new Date(msg.createdAt).toDateString();
    if (msgDate !== prevDate) {
      groupedMessages.push({ type: 'date', date: msg.createdAt, key: `date-${i}` });
      prevDate = msgDate;
      prevSenderId = null;
    }
    const nextMsg = messages[i + 1];
    const isFirst = msg.sender._id !== prevSenderId;
    const isLast =
      !nextMsg ||
      nextMsg.sender._id !== msg.sender._id ||
      new Date(nextMsg.createdAt).toDateString() !== msgDate;

    groupedMessages.push({ type: 'msg', msg, isFirst, isLast, key: msg._id || i });
    prevSenderId = msg.sender._id;
  });

  if (!conversationId) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-bg gap-4 select-none">
        <div className="w-20 h-20 rounded-full bg-brand-100 dark:bg-dark-surface flex items-center justify-center">
          <MessageCircle className="w-10 h-10 text-brand-500 dark:text-dark-brand" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-dark-text-primary">
            Select a conversation
          </h3>
          <p className="text-sm text-gray-400 dark:text-dark-text-secondary mt-1">
            Choose a chat from the left to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50 dark:bg-dark-bg">
      {/* ── Header ── */}
      <div className="flex-shrink-0 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border px-4 h-16 flex items-center gap-3 shadow-sm">
        {/* Back arrow – visible on mobile or when onBack is provided */}
        <button
          onClick={onBack}
          className="md:hidden p-1.5 -ml-1 rounded-lg text-gray-500 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-surface-elevated transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <Avatar name={otherUser?.name} size="md" />

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 dark:text-dark-text-primary truncate leading-tight">
            {otherUser?.name || 'Loading…'}
          </h2>
          {typingUser ? (
            <p className="text-xs text-brand-600 dark:text-dark-brand animate-pulse">
              typing…
            </p>
          ) : (
            <p className="text-xs text-gray-400 dark:text-dark-text-secondary">Online</p>
          )}
        </div>

        <button className="p-2 rounded-xl text-gray-500 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-surface-elevated transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 min-h-0 overflow-y-auto chat-messages-scroll px-4 py-4 space-y-1">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-dark-text-secondary">
              <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin" />
              <span className="text-sm">Loading messages…</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 gap-3">
            <MessageCircle className="w-12 h-12 text-gray-300 dark:text-slate-600" />
            <p className="text-gray-500 dark:text-dark-text-primary font-medium">
              No messages yet
            </p>
            <p className="text-sm text-gray-400 dark:text-dark-text-secondary max-w-xs">
              Send a message to start your conversation with {otherUser?.name || 'this person'}.
            </p>
          </div>
        ) : (
          groupedMessages.map((item) => {
            if (item.type === 'date') {
              return <DateSeparator key={item.key} date={item.date} />;
            }
            const isOwn = item.msg.sender._id === currentUser?._id;
            return (
              <Bubble
                key={item.key}
                message={item.msg}
                isOwn={isOwn}
                showAvatar={item.isLast}
                senderName={item.msg.sender?.name}
                isFirst={item.isFirst}
                isLast={item.isLast}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Typing indicator ── */}
      {typingUser && (
        <div className="px-6 pb-1 flex-shrink-0">
          <div className="inline-flex items-center gap-1.5 bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl px-3 py-2 shadow-sm">
            <span className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </span>
            <span className="text-xs text-gray-500 dark:text-dark-text-secondary">
              {typingUser} is typing
            </span>
          </div>
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="flex-shrink-0 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border px-4 py-3">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <div className="flex-1 flex items-end bg-gray-100 dark:bg-dark-surface-elevated rounded-2xl px-4 py-2.5 gap-2 border border-transparent focus-within:border-brand-400 dark:focus-within:border-dark-brand transition-colors">
            <textarea
              ref={inputRef}
              rows={1}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
                // Auto-grow
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message… (Enter to send)"
              className="flex-1 bg-transparent text-sm text-gray-800 dark:text-dark-text-primary placeholder-gray-400 dark:placeholder-dark-text-secondary outline-none leading-relaxed max-h-[120px] overflow-y-auto chat-input-textarea"
              style={{ height: '22px' }}
            />
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-600 dark:bg-dark-brand text-white flex items-center justify-center shadow-md hover:bg-brand-700 dark:hover:bg-dark-brand-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   SIDEBAR – conversation list
───────────────────────────────────────────────────── */
const Sidebar = ({ conversations, loading, activeId, onSelect, searchQuery, onSearchChange }) => {
  const currentUser = currentUserFromStorage();

  const filtered = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const other = c.participants?.find((p) => p._id !== currentUser?._id);
    return other?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border">
      {/* Sidebar header */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-gray-100 dark:border-dark-border">
        <h1 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary mb-3">
          Messages
        </h1>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-dark-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations…"
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-100 dark:bg-dark-surface-elevated text-sm text-gray-700 dark:text-dark-text-primary placeholder-gray-400 dark:placeholder-dark-text-secondary outline-none focus:ring-2 focus:ring-brand-400 dark:focus:ring-dark-brand transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-y-auto chat-messages-scroll">
        {loading ? (
          <div className="flex flex-col gap-3 p-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-dark-surface-elevated flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-dark-surface-elevated rounded w-3/4" />
                  <div className="h-2.5 bg-gray-200 dark:bg-dark-surface-elevated rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12 gap-3">
            <MessageCircle className="w-10 h-10 text-gray-300 dark:text-slate-600" />
            {searchQuery ? (
              <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                No conversations match "{searchQuery}"
              </p>
            ) : (
              <>
                <p className="font-medium text-gray-600 dark:text-dark-text-primary text-sm">
                  No conversations yet
                </p>
                <p className="text-xs text-gray-400 dark:text-dark-text-secondary">
                  Start by messaging a seller or service provider.
                </p>
                <div className="flex flex-col gap-2 mt-2 w-full">
                  <Link
                    to="/products"
                    className="text-center py-2 px-4 rounded-xl bg-brand-600 dark:bg-dark-brand text-white text-sm font-medium hover:bg-brand-700 dark:hover:bg-dark-brand-hover transition-colors"
                  >
                    Browse Products
                  </Link>
                  <Link
                    to="/services"
                    className="text-center py-2 px-4 rounded-xl bg-gray-100 dark:bg-dark-surface-elevated text-gray-700 dark:text-dark-text-primary text-sm font-medium hover:bg-gray-200 dark:hover:bg-dark-surface transition-colors"
                  >
                    Browse Services
                  </Link>
                </div>
              </>
            )}
          </div>
        ) : (
          filtered.map((conv) => (
            <ConvItem
              key={conv._id}
              conv={conv}
              active={conv._id === activeId}
              currentUser={currentUser}
              onClick={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   MAIN CHAT PAGE
───────────────────────────────────────────────────── */
const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile: track whether we're showing the list or the chat panel
  const showingList = !conversationId;

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoadingConvs(true);
      const data = await getMyConversations();
      setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConvs(false);
    }
  };

  const handleSelectConv = (id) => {
    navigate(`/chat/${id}`);
  };

  const handleBack = () => {
    navigate('/chat');
  };

  return (
    /*
      Full-height container that the Layout's <main> already constrains
      to h-full w-full flex flex-col overflow-hidden on chat routes.
    */
    <div className="h-full flex overflow-hidden">
      {/*
        ── SIDEBAR ──────────────────────────────────────────────
        Desktop: always visible (w-80 flex-shrink-0)
        Mobile: visible only when no conversation is selected
      */}
      <div
        className={`
          flex-shrink-0 w-full md:w-80
          ${showingList ? 'flex' : 'hidden'} md:flex
          flex-col overflow-hidden
        `}
      >
        <Sidebar
          conversations={conversations}
          loading={loadingConvs}
          activeId={conversationId}
          onSelect={handleSelectConv}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/*
        ── RIGHT PANEL ──────────────────────────────────────────
        Desktop: always visible (flex-1)
        Mobile: visible only when a conversation IS selected
      */}
      <div
        className={`
          flex-1 min-w-0 overflow-hidden
          ${showingList ? 'hidden' : 'flex'} md:flex
          flex-col
        `}
      >
        <ChatPanel
          key={conversationId}
          conversationId={conversationId}
          conversations={conversations}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default ChatPage;
