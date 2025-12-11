import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import UserForm from './components/UserForm';
import ChatBox from './components/ChatBox';
import EmailClassify from './components/EmailClassify';
import api from './services/api';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav style={{
      background: 'white',
      padding: '15px 30px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px',
      display: 'flex',
      gap: '20px',
      alignItems: 'center'
    }}>
      <Link 
        to="/" 
        style={{
          textDecoration: 'none',
          color: location.pathname === '/' ? '#667eea' : '#666',
          fontWeight: location.pathname === '/' ? '600' : '400',
          fontSize: '16px',
          padding: '8px 16px',
          borderRadius: '6px',
          background: location.pathname === '/' ? '#f3f4f6' : 'transparent',
          transition: 'all 0.2s'
        }}
      >
        💬 Chatbot
      </Link>
      <Link 
        to="/email-classify" 
        style={{
          textDecoration: 'none',
          color: location.pathname === '/email-classify' ? '#667eea' : '#666',
          fontWeight: location.pathname === '/email-classify' ? '600' : '400',
          fontSize: '16px',
          padding: '8px 16px',
          borderRadius: '6px',
          background: location.pathname === '/email-classify' ? '#f3f4f6' : 'transparent',
          transition: 'all 0.2s'
        }}
      >
        📧 Email Classify
      </Link>
    </nav>
  );
}

function ChatApp() {
  const [sessionId, setSessionId] = useState(null);
  const [sessionStatus, setSessionStatus] = useState(null);
  const [userName, setUserName] = useState('');

  const handleUserSubmit = async (name, email, phone) => {
    try {
      const session = await api.createSession(name, email, phone);
      
      setSessionId(session.session_id);
      setSessionStatus(session.status);
      setUserName(name);
      
      console.log('Session created:', session);
    } catch (error) {
      alert('Error creating session: ' + error.message);
    }
  };

  // Show user form if no session
  if (!sessionId) {
    return <UserForm onSubmit={handleUserSubmit} />;
  }

  // Show chat interface once session created
  return (
    <ChatBox 
      sessionId={sessionId} 
      sessionStatus={sessionStatus}
      userName={userName}
    />
  );
}

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <Navigation />
        <Routes>
          <Route path="/" element={<ChatApp />} />
          <Route path="/email-classify" element={<EmailClassify />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
