import { useState } from 'react';
import UserForm from './components/UserForm';
import ChatBox from './components/ChatBox';
import api from './services/api';

function App() {
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

export default App;
