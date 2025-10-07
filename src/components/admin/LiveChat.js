import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useChat } from '../../context/ChatContext';

const ChatContainer = styled.div`
  display: flex;
  height: calc(100vh - 180px);
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const ConversationsList = styled.div`
  width: 300px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
`;

const ConversationsHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 1.2rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-top: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ConversationItem = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  
  ${({ active, theme }) => active && `
    background-color: rgba(255, 255, 255, 0.05);
    border-left: 3px solid ${theme.colors.secondary};
  `}
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ConversationInfo = styled.div`
  flex: 1;
  overflow: hidden;
`;

const ConversationName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.3rem;
`;

const LastMessage = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UnreadBadge = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const ChatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
`;

const ChatName = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.2rem;
`;

const ChatStatus = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-left: 1rem;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ sent }) => sent ? 'flex-end' : 'flex-start'};
  margin-bottom: 1.5rem;
`;

const MessageBubble = styled.div`
  background-color: ${({ sent, theme }) => 
    sent ? theme.colors.secondary : 'rgba(255, 255, 255, 0.05)'};
  color: ${({ sent, theme }) => 
    sent ? theme.colors.primary : theme.colors.text};
  padding: 0.8rem 1rem;
  border-radius: 18px;
  border-bottom-right-radius: ${({ sent }) => sent ? '4px' : '18px'};
  border-bottom-left-radius: ${({ sent }) => sent ? '18px' : '4px'};
  max-width: 70%;
  margin-bottom: 0.3rem;
  word-wrap: break-word;
`;

const MessageTime = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 0.3rem;
`;

const ChatInputContainer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ChatInputForm = styled.form`
  display: flex;
  align-items: center;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  background-color: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const SendButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }
  
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const EmptyChatState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.1);
  }
  
  p {
    font-size: 1.1rem;
  }
`;

const LiveChat = () => {
  const { 
    conversations, 
    activeConversation, 
    messages, 
    loadConversations, 
    loadMessages, 
    sendMessage 
  } = useChat();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    loadConversations();
  }, []);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleConversationClick = (userId) => {
    loadMessages(userId);
  };
  
  const handleMessageChange = (e) => {
    setMessageInput(e.target.value);
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !activeConversation) return;
    
    setSending(true);
    try {
      await sendMessage(activeConversation, messageInput);
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const filteredConversations = conversations.filter(conversation => 
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <ChatContainer>
      <ConversationsList>
        <ConversationsHeader>
          <h2>Conversations</h2>
          <SearchInput 
            type="text" 
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </ConversationsHeader>
        
        {filteredConversations.map(conversation => (
          <ConversationItem 
            key={conversation.id}
            active={activeConversation === conversation.id}
            onClick={() => handleConversationClick(conversation.id)}
          >
            <Avatar>{getInitials(conversation.name)}</Avatar>
            <ConversationInfo>
              <ConversationName>{conversation.name}</ConversationName>
              <LastMessage>{conversation.lastMessage}</LastMessage>
            </ConversationInfo>
            {conversation.unread > 0 && (
              <UnreadBadge>{conversation.unread}</UnreadBadge>
            )}
          </ConversationItem>
        ))}
      </ConversationsList>
      
      <ChatContent>
        {activeConversation ? (
          <>
            <ChatHeader>
              <Avatar>
                {getInitials(conversations.find(c => c.id === activeConversation)?.name || '')}
              </Avatar>
              <ChatName>
                {conversations.find(c => c.id === activeConversation)?.name}
              </ChatName>
              <ChatStatus>En ligne</ChatStatus>
            </ChatHeader>
            
            <MessagesContainer>
              {messages.map((message, index) => {
                const sent = message.sender_id !== activeConversation;
                const showTime = index === 0 || 
                  messages[index - 1].sender_id !== message.sender_id || 
                  new Date(message.created_at) - new Date(messages[index - 1].created_at) > 5 * 60 * 1000;
                
                return (
                  <MessageGroup key={message.id} sent={sent}>
                    <MessageBubble sent={sent}>
                      {message.content}
                    </MessageBubble>
                    {showTime && (
                      <MessageTime>{formatTime(message.created_at)}</MessageTime>
                    )}
                  </MessageGroup>
                );
              })}
              <div ref={messagesEndRef} />
            </MessagesContainer>
            
            <ChatInputContainer>
              <ChatInputForm onSubmit={handleSendMessage}>
                <ChatInput 
                  type="text" 
                  placeholder="Tapez votre message..."
                  value={messageInput}
                  onChange={handleMessageChange}
                />
                <SendButton type="submit" disabled={sending || !messageInput.trim()}>
                  <i className="fas fa-paper-plane"></i>
                </SendButton>
              </ChatInputForm>
            </ChatInputContainer>
          </>
        ) : (
          <EmptyChatState>
            <i className="fas fa-comments"></i>
            <p>Sélectionnez une conversation pour commencer à discuter</p>
          </EmptyChatState>
        )}
      </ChatContent>
    </ChatContainer>
  );
};

export default LiveChat;