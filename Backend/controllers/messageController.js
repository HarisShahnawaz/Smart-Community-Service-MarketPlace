const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get or create a conversation with another user
// @route   POST /api/messages/conversations
// @access  Private
const getOrCreateConversation = async (req, res, next) => {
  try {
    const { recipientId } = req.body;

    if (!recipientId) {
      res.status(400);
      throw new Error('Recipient ID is required');
    }

    if (recipientId === req.user.id) {
      res.status(400);
      throw new Error('You cannot message yourself');
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      res.status(404);
      throw new Error('Recipient not found');
    }

    // Check if conversation already exists between both users
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, recipientId] }
    }).populate('participants', 'name avatar')
      .populate('lastMessage');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, recipientId]
      });
      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name avatar')
        .populate('lastMessage');
    }

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
const getMyConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
      .populate('participants', 'name avatar')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages in a conversation
// @route   GET /api/messages/conversations/:conversationId
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404);
      throw new Error('Conversation not found');
    }

    // Ensure user is a participant
    if (!conversation.participants.includes(req.user.id)) {
      res.status(403);
      throw new Error('Not authorized to view this conversation');
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark all unread messages (from the other person) as read
    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: req.user.id }, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message in a conversation
// @route   POST /api/messages/conversations/:conversationId
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      res.status(400);
      throw new Error('Message text is required');
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404);
      throw new Error('Conversation not found');
    }

    if (!conversation.participants.includes(req.user.id)) {
      res.status(403);
      throw new Error('Not authorized to send messages in this conversation');
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      text: text.trim()
    });

    // Update conversation's last message reference and timestamp
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar');

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread message count for current user
// @route   GET /api/messages/unread-count
// @access  Private
const getUnreadCount = async (req, res, next) => {
  try {
    // Find conversations the user is part of
    const conversations = await Conversation.find({ participants: req.user.id }, '_id');
    const conversationIds = conversations.map(c => c._id);

    const count = await Message.countDocuments({
      conversation: { $in: conversationIds },
      sender: { $ne: req.user.id },
      read: false
    });

    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrCreateConversation,
  getMyConversations,
  getMessages,
  sendMessage,
  getUnreadCount
};
