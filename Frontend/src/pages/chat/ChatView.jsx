import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMessages, sendMessage } from '../../api/messageApi';
import { useSocket } from '../../context/SocketContext';
import { ArrowLeft, Send, User } from 'lucide-react';

const ChatView = () => {
  const { conversationId } = useParams();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchMessages();
    joinConversation();

    return () => {
      leaveConversation();
    };
  }, [conversationId]);

  useEffect(() => {
    if (!socket?.current) return;

    // Listen for new messages
    socket.current.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for typing indicators
    socket.current.on('user_typing', (data) => {
      if (data.userId !== currentUser._id) {
        setTypingUser(data.name);
      }
    });

    socket.current.on('user_stop_typing', (data) => {
      if (data.userId !== currentUser._id) {
        setTypingUser(null);
      }
    });

    return () => {
      socket.current?.off('receive_message');
      socket.current?.off('user_typing');
      socket.current?.off('user_stop_typing');
    };
  }, [socket, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages(conversationId);
      setMessages(data);
      
      // Extract other user info from first message or conversation
      if (data.length > 0) {
        const other = data.find(m => m.sender._id !== currentUser._id)?.sender;
        if (other) setOtherUser(other);
      }
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const joinConversation = () => {
    socket?.current?.emit('join_conversation', conversationId);
  };

  const leaveConversation = () => {
    socket?.current?.emit('leave_conversation', conversationId);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      const message = await sendMessage(conversationId, messageText);
      setMessages((prev) => [...prev, message]);
      
      // Emit via socket for real-time delivery
      socket?.current?.emit('send_message', {
        conversationId,
        message
      });
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    }
  };

  const handleTyping = () => {
    socket?.current?.emit('typing', {
      conversationId,
      userId: currentUser._id,
      name: currentUser.name
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing indicator after 1 second of no typing
    typingTimeoutRef.current = setTimeout(() => {
      socket?.current?.emit('stop_typing', {
        conversationId,
        userId: currentUser._id,
        name: currentUser.name
      });
    }, 1000);
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading conversation...</div>
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 shadow-sm">
        <Link to="/chat" className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
            {otherUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">
              {otherUser?.name || 'Unknown User'}
            </h2>
            {typingUser && (
              <p className="text-xs text-blue-500">{typingUser} is typing...</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <MessageCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium mb-2">No messages yet</p>
            <p className="text-slate-500 dark:text-slate-500 text-sm max-w-md">Start the conversation by introducing yourself and discussing the service or product you're interested in!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender._id === currentUser._id;
            return (
              <div
                key={message._id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isOwn ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p className="break-words">{message.text}</p>
                  </div>
                  <p
                    className={`text-xs text-gray-500 mt-1 ${
                      isOwn ? 'text-right' : 'text-left'
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
