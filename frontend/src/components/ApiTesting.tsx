import React, { useState } from 'react';

interface ApiTestingProps {}

const ApiTesting: React.FC<ApiTestingProps> = () => {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSendRequest = async () => {
    setLoading(true);
    setResponse(null);
    
    try {
      let parsedHeaders = {};
      if (headers.trim()) {
        parsedHeaders = JSON.parse(headers);
      }

      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...parsedHeaders
        }
      };

      if (method !== 'GET' && body.trim()) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const data = await res.json().catch(() => res.text());

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data
      });
    } catch (error: any) {
      setResponse({
        error: true,
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-container">
      <h1 className="view-title">API Testing</h1>
      
      <div className="content-card" style={{ marginBottom: '20px' }}>
        <h3>API Request</h3>
        
        <div className="form-group">
          <label>Method</label>
          <select 
            value={method} 
            onChange={(e) => setMethod(e.target.value as any)}
            className="form-select"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div className="form-group">
          <label>URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Headers (JSON)</label>
          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            placeholder='{"Authorization": "Bearer token", "X-Custom-Header": "value"}'
            className="form-textarea"
            rows={4}
          />
        </div>

        {method !== 'GET' && (
          <div className="form-group">
            <label>Body (JSON or text)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder='{"key": "value"}'
              className="form-textarea"
              rows={6}
            />
          </div>
        )}

        <button 
          onClick={handleSendRequest} 
          disabled={loading || !url}
          className="btn-primary"
        >
          {loading ? '⏳ Sending...' : '🚀 Send Request'}
        </button>
      </div>

      {response && (
        <div className="content-card">
          <h3>Response</h3>
          
          {response.error ? (
            <div style={{ color: '#ef4444' }}>
              <strong>Error:</strong> {response.message}
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '16px' }}>
                <strong>Status:</strong>{' '}
                <span 
                  style={{ 
                    color: response.status >= 200 && response.status < 300 ? '#10b981' : '#ef4444',
                    fontWeight: 600
                  }}
                >
                  {response.status} {response.statusText}
                </span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong>Headers:</strong>
                <pre style={{ 
                  background: '#f3f4f6', 
                  padding: '12px', 
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '13px'
                }}>
                  {JSON.stringify(response.headers, null, 2)}
                </pre>
              </div>

              <div>
                <strong>Body:</strong>
                <pre style={{ 
                  background: '#f3f4f6', 
                  padding: '12px', 
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '13px',
                  maxHeight: '400px'
                }}>
                  {typeof response.data === 'string' 
                    ? response.data 
                    : JSON.stringify(response.data, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiTesting;
