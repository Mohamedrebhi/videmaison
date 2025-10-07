import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const { isAuthenticated, user } = useAuth();
  const { socket, connected } = useSocket();

  useEffect(() => {
    if (!socket || !connected || !isAuthenticated || !user) return;

    // Listen for new messages
    socket.on('new_message', (message) => {
      if (activeConversation === message.sender_id) {
        setMessages(prev => [...prev, message]);
        // Mark message as read
        markMessageAsRead(message.id);
      }
      
      // Update conversation list
      updateConversationWithMessage(message);
    });

    return () => {
      socket.off('new_message');
    };
  }, [socket, connected, isAuthenticated, user, activeConversation]);

  const loadConversations = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await axios.get('http://localhost:5000/api/chat/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (userId) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/api/chat/messages/${userId}`);
      setMessages(response.data);
      setActiveConversation(userId);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async (receiverId, content, messageType = 'text') => {
    if (!isAuthenticated) return;
    
    try {
      const response = await axios.post(`http://localhost:5000/api/chat/messages/${receiverId}`, {
        content,
        message_type: messageType
      });
      
      setMessages(prev => [...prev, response.data]);
      updateConversationWithMessage(response.data);
      
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      return null;
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await axios.put(`http://localhost:5000/api/chat/messages/${messageId}/read`);
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const updateConversationWithMessage = (message) => {
    if (!user) return;
    
    const conversationId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
    
    setConversations(prev => {
      const existing = prev.find(c => c.id === conversationId);
      
      if (existing) {
        return prev.map(c => 
          c.id === conversationId 
            ? { 
                ...c, 
                lastMessage: message.content,
                lastMessageTime: message.created_at,
                unread: message.sender_id !== user.id ? (c.unread || 0) + 1 : c.unread
              } 
            : c
        ).sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
      } else {
        const newConversation = {
          id: conversationId,
          name: 'New conversation',
          lastMessage: message.content,
          lastMessageTime: message.created_at,
          unread: message.sender_id !== user.id ? 1 : 0
        };
        
        return [newConversation, ...prev];
      }
    });
  };

  const value = {
    conversations,
    activeConversation,
    messages,
    loadConversations,
    loadMessages,
    sendMessage,
    markMessageAsRead
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};