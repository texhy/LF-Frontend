import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

/**
 * MessageContent Component
 * 
 * Renders bot messages with proper markdown formatting:
 * - Bold text
 * - Numbered and bullet lists
 * - Clickable links
 * - Line breaks
 * - Emojis
 */
function MessageContent({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkBreaks]}
      components={{
        // Style paragraphs with proper spacing
        p: ({ children }) => (
          <p style={{ margin: '0 0 12px 0', lineHeight: '1.6', color: 'inherit' }}>
            {children}
          </p>
        ),
        // Style bold text
        strong: ({ children }) => (
          <strong style={{ fontWeight: '600', color: 'inherit' }}>
            {children}
          </strong>
        ),
        // Style lists with proper spacing
        ul: ({ children }) => (
          <ul style={{
            margin: '8px 0 12px 20px',
            paddingLeft: '20px',
            lineHeight: '1.6'
          }}>
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol style={{
            margin: '8px 0 12px 20px',
            paddingLeft: '20px',
            lineHeight: '1.6'
          }}>
            {children}
          </ol>
        ),
        // Style list items
        li: ({ children }) => (
          <li style={{ marginBottom: '6px', lineHeight: '1.6' }}>
            {children}
          </li>
        ),
        // Make links clickable and styled
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#0066cc',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.target.style.color = '#0052a3'}
            onMouseLeave={(e) => e.target.style.color = '#0066cc'}
          >
            {children}
          </a>
        ),
        // Preserve line breaks
        br: () => <br />,
      }}
      style={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        fontSize: '14px',
        color: 'inherit'
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default MessageContent;

