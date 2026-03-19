const Message = require('../models/Message');
const User = require('../models/User');
const { USER_ROLES } = require('../utils/constants');


const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      message
    });
    
    await newMessage.save();
    await newMessage.populate('sender', 'name email role');
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
    
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$message' },
          lastMessageTime: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ['$receiver', userId] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$user._id',
          name: '$user.name',
          email: '$user.email',
          role: '$user.role',
          lastMessage: 1,
          lastMessageTime: 1,
          unreadCount: 1
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      conversations,
      count: conversations.length
    });
    
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherUserId } = req.params;
    const { limit = 50, before } = req.query;

    const otherUser = await User.findById(otherUserId).select('name email role');
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const query = {
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    };
    
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }
    
    const messages = await Message.find(query)
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: userId,
        read: false
      },
      { $set: { read: true } }
    );
    
    res.status(200).json({
      success: true,
      otherUser,
      messages: messages.reverse(), 
      hasMore: messages.length === parseInt(limit)
    });
    
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { messageIds } = req.body;
    
    await Message.updateMany(
      {
        _id: { $in: messageIds },
        receiver: userId,
        read: false
      },
      { $set: { read: true } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
    
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read'
    });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;
    
    const message = await Message.findOne({
      _id: messageId,
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    });
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or unauthorized'
      });
    }
    
    await message.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const unreadCount = await Message.countDocuments({
      receiver: userId,
      read: false
    });
    
    res.status(200).json({
      success: true,
      unreadCount
    });
    
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
};

module.exports = {
  sendMessage,
  getConversations,
  getMessages,
  markAsRead,
  deleteMessage,
  getUnreadCount
};