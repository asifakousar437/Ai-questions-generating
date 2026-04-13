import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, User, Bot, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const API_URL = 'http://localhost:8080/api/ai/chat';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I\'m your AI study assistant. Do you have any follow-up questions about this interview set? Ask me anything!' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(API_URL, {
        messages: [...messages, userMessage].map(({ role, content }) => ({ role, content }))
      });

      const aiMessage = { role: 'assistant', content: response.data.message };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: 'Oops! I had a connection hiccup. Is the backend server running?' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Toggle Button */}
      <button 
        className="chatbot-toggle" 
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) setIsMaximized(false);
        }}
        title={isOpen ? "Close Chat" : "Ask AI Assistant"}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`chat-window ${isMaximized ? 'maximized' : ''}`}>
          <div className="chat-header">
            <div className="chat-header-info">
              <Bot size={24} color="white" />
              <h3>AI Study Assistant</h3>
            </div>
            <div className="chat-header-actions">
              <button 
                className="chat-action-btn" 
                onClick={() => setIsMaximized(!isMaximized)}
                title={isMaximized ? "Minimize" : "Maximize"}
              >
                {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button className="chat-action-btn" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                <div className="message-icon">
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="message-bubble">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-message assistant">
                <div className="message-icon"><Bot size={16} /></div>
                <div className="message-bubble loading">
                  <Loader2 size={18} className="spinner-icon" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask a follow-up question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={!input.trim() || loading}>
              <Send size={20} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        .chatbot-wrapper {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
          font-family: inherit;
        }

        .chatbot-toggle {
          background: var(--primary-color);
          color: white;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: none;
          box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .chatbot-toggle:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 6px 20px rgba(249, 115, 22, 0.5);
        }

        .chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 500px;
          background: white;
          border-radius: 1.5rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid var(--border-color);
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chat-window.maximized {
          width: min(800px, 90vw);
          height: min(750px, 85vh);
          border-radius: 1rem;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chat-header {
          background: var(--primary-color);
          padding: 1rem 1.2rem;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .chat-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .chat-header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .chat-action-btn {
          background: transparent;
          border: none;
          color: white;
          opacity: 0.8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.4rem;
          border-radius: 0.5rem;
          transition: background 0.2s;
        }

        .chat-action-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          opacity: 1;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          background: #fdfcfb;
        }

        .chat-message {
          display: flex;
          gap: 0.8rem;
          max-width: 85%;
        }

        .chat-message.user {
          flex-direction: row-reverse;
          align-self: flex-end;
        }

        .message-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          flex-shrink: 0;
        }

        .user .message-icon {
          background: #fff7ed;
          color: var(--primary-color);
        }

        .message-bubble {
          padding: 0.8rem 1rem;
          border-radius: 1rem;
          font-size: 0.95rem;
          line-height: 1.4;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .assistant .message-bubble {
          background: white;
          color: var(--text-primary);
          border-bottom-left-radius: 0.2rem;
          border: 1px solid #e2e8f0;
        }

        .user .message-bubble {
          background: var(--primary-color);
          color: white;
          border-bottom-right-radius: 0.2rem;
        }

        .message-bubble p { margin: 0; }

        .loading {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }

        .spinner-icon {
          animation: rotate 1s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .chat-input-area {
          padding: 1rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          gap: 0.5rem;
          background: white;
        }

        .chat-input-area input {
          flex: 1;
          border: 1px solid var(--border-color);
          padding: 0.8rem 1rem;
          border-radius: 2rem;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .chat-input-area input:focus {
          border-color: var(--primary-color);
        }

        .chat-input-area button {
          background: var(--primary-color);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .chat-input-area button:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .chat-input-area button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
