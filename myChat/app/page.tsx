'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    fetch('/api/chat'); // Initialize WS server

    const socket = new WebSocket(`ws://${window.location.host}/api/chat`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

    const message = `${name}: ${input}`;
    socketRef.current.send(message);
    setInput('');
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>TinyChat</h1>
      <input
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <div>
        <input
          placeholder="Type message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: '300px' }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <ul style={{ marginTop: 20 }}>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </main>
  );
}

