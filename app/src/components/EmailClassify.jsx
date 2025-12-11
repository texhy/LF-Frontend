import { useState } from 'react';
import api from '../services/api';
import MessageContent from './MessageContent';

function EmailClassify() {
  const [formData, setFormData] = useState({
    subject: '',
    text: '',
    from_email: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.text.trim()) {
      setError('Subject and email text are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.classifyEmail(
        formData.subject,
        formData.text,
        formData.from_email
      );

      // Add result to history
      const newResult = {
        id: Date.now(),
        input: { ...formData },
        response: response,
        timestamp: new Date()
      };

      setResults(prev => [newResult, ...prev]);
      
      // Clear form
      setFormData({
        subject: '',
        text: '',
        from_email: ''
      });
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to classify email');
    } finally {
      setLoading(false);
    }
  };

  const getLabelColor = (labelId) => {
    const colors = {
      'BUY_NOW': '#10b981',      // green
      'BUY_LATER': '#3b82f6',    // blue
      'FOLLOW_UP': '#8b5cf6',    // purple
      'CUSTOMER_SERVICE': '#f59e0b', // amber
      'OBJECTION': '#ef4444',    // red
      'NEUTRAL': '#6b7280'       // gray
    };
    return colors[labelId] || '#6b7280';
  };

  const getLabelBadgeStyle = (labelId) => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    background: getLabelColor(labelId),
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  });

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>📧 Email Classification & Reply Generator</h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
          Test email classification and automatic reply generation
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left Column - Form */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: 'fit-content',
          position: 'sticky',
          top: '20px'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '20px', color: '#333' }}>
            Email Input
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#555'
              }}>
                Subject <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="e.g., What is CPR and how much does it cost?"
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#555'
              }}>
                Email Text <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                placeholder="e.g., I want to know about CPR training and pricing for 10 employees."
                required
                disabled={loading}
                rows={6}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#555'
              }}>
                From Email (Optional)
              </label>
              <input
                type="email"
                name="from_email"
                value={formData.from_email}
                onChange={handleInputChange}
                placeholder="e.g., manager@company.com"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            {error && (
              <div style={{
                padding: '12px',
                background: '#fee2e2',
                color: '#dc2626',
                borderRadius: '8px',
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.subject.trim() || !formData.text.trim()}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '1';
              }}
            >
              {loading ? '⏳ Processing...' : '🚀 Classify & Generate Reply'}
            </button>
          </form>
        </div>

        {/* Right Column - Results */}
        <div>
          <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '20px', color: '#333' }}>
            Results {results.length > 0 && <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>({results.length})</span>}
          </h2>

          {results.length === 0 ? (
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textAlign: 'center',
              color: '#666'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📬</div>
              <p style={{ margin: 0, fontSize: '16px' }}>
                No results yet. Submit an email to see classification and generated reply.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {results.map((result) => (
                <div
                  key={result.id}
                  style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  {/* Classification Badge */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span style={getLabelBadgeStyle(result.response.classification.label_id)}>
                        {result.response.classification.label_id}
                      </span>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {result.response.classification.gmail_label}
                      </span>
                      <span style={{ 
                        fontSize: '12px', 
                        color: '#666',
                        marginLeft: 'auto'
                      }}>
                        {(result.response.classification.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      {result.timestamp.toLocaleString()}
                    </div>
                  </div>

                  {/* Original Email */}
                  <div style={{ 
                    marginBottom: '20px',
                    padding: '15px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    borderLeft: '4px solid #667eea'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                      ORIGINAL EMAIL
                    </div>
                    <div style={{ fontSize: '13px', color: '#333', marginBottom: '5px' }}>
                      <strong>Subject:</strong> {result.input.subject}
                    </div>
                    {result.input.from_email && (
                      <div style={{ fontSize: '13px', color: '#666' }}>
                        <strong>From:</strong> {result.input.from_email}
                      </div>
                    )}
                    <div style={{ fontSize: '13px', color: '#333', marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                      {result.input.text}
                    </div>
                  </div>

                  {/* Generated Reply */}
                  <div style={{ 
                    marginBottom: '20px',
                    padding: '15px',
                    background: '#f0fdf4',
                    borderRadius: '8px',
                    borderLeft: '4px solid #10b981'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '10px' }}>
                      GENERATED REPLY
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#333',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap'
                    }}>
                      <MessageContent content={result.response.reply_text} />
                    </div>
                  </div>

                  {/* Tools Used */}
                  {result.response.used_tools && result.response.used_tools.length > 0 && (
                    <div style={{
                      padding: '12px',
                      background: '#eff6ff',
                      borderRadius: '8px',
                      fontSize: '13px'
                    }}>
                      <strong style={{ color: '#1e40af' }}>🔧 Tools Used:</strong>{' '}
                      {result.response.used_tools.map((tool, idx) => (
                        <span key={idx}>
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            background: '#3b82f6',
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '11px',
                            marginLeft: '5px'
                          }}>
                            {tool}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Category Info */}
                  <div style={{ 
                    marginTop: '15px',
                    padding: '10px',
                    background: '#f9fafb',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    <strong>Category:</strong> {result.response.classification.category}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailClassify;

