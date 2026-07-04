const express = require('express');
const {
  getOrCreateConversation,
  getMyConversations,
  getMessages,
  sendMessage,
  getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All message routes require auth
router.use(protect);

router.get('/unread-count', getUnreadCount);

router.route('/conversations')
  .get(getMyConversations)
  .post(getOrCreateConversation);

router.route('/conversations/:conversationId')
  .get(getMessages)
  .post(sendMessage);

module.exports = router;
