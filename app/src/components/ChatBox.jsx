import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

function ChatBox({ sessionId, sessionStatus, userName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Add welcome message
    const welcomeMsg = sessionStatus === 'returning_user'
      ? `Welcome back, ${userName}! I remember our previous conversations. How can I help you today?`
      : `Welcome, ${userName}! I'm your LifeGuard-Pro assistant. How can I help you today?`;
    
    setMessages([{
      type: 'bot',
      content: welcomeMsg,
      timestamp: new Date()
    }]);
  }, [sessionStatus, userName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    // Add user message
    const userMsg = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Call API
      const response = await api.sendMessage(sessionId, input);
      
      // Add bot response
      const botMsg = {
        type: 'bot',
        content: response.response,
        toolCalls: response.tool_calls,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: '❌ Error: Could not get response. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!confirm('End this session? A summary will be generated.')) return;
    
    try {
      await api.endSession(sessionId);
      alert('Session ended! Summary generated for future reference.');
      window.location.reload();
    } catch (error) {
      alert('Error ending session');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: '#0066cc', color: 'white', padding: '15px 20px' }}>
        <h3 style={{ margin: 0 }}>LifeGuard-Pro Assistant</h3>
        <small>
          User: {userName} | 
          {sessionStatus === 'returning_user' && ' 🔄 Returning User'} |
          Session: {sessionId.slice(0, 8)}...
        </small>
        <button 
          onClick={handleEndSession}
          style={{
            float: 'right',
            padding: '5px 10px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          End Session
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#f5f5f5' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            marginBottom: '15px',
            display: 'flex',
            justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '10px 15px',
              background: msg.type === 'user' ? '#0066cc' : 'white',
              color: msg.type === 'user' ? 'white' : 'black',
              borderRadius: '10px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              <div>{msg.content}</div>
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div style={{ fontSize: '11px', marginTop: '5px', opacity: 0.8 }}>
                  🔧 Tools: {msg.toolCalls.join(', ')}
                </div>
              )}
              <div style={{ fontSize: '10px', marginTop: '5px', opacity: 0.6 }}>
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: 'center', color: '#666' }}>
            <em>Thinking...</em>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '15px', background: 'white', borderTop: '1px solid #ddd' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about courses, pricing, etc..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          />
          <button 
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 25px',
              background: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;

