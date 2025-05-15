// import React, { useEffect, useState } from 'react';
// import { createClient, RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";

// // Konfigurasi Supabase
// const SUPABASE_URL = "https://hqehexdrofifodonauez.supabase.co";
// const SUPABASE_KEY =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxZWhleGRyb2ZpZm9kb25hdWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMDE3NzEsImV4cCI6MjA1Mzc3Nzc3MX0.YwJvBYOZuNZTNsEPBZQwocHSy_rB-ufRE11a-_c9YWs";

// const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// // Interface untuk message
// interface Message {
//   payload: {
//     username: string;
//     message: string;
//     timestamp: string;
//   };
// }

// // Interface untuk presence data
// interface PresenceData {
//   user: string;
//   online_at: string;
// }

// // Buat fungsi untuk mendapatkan channel
// const getChannel = (): RealtimeChannel => {
//   return supabase.channel("test-channel");
// };

// // Props untuk ErrorBoundary
// interface ErrorBoundaryProps {
//   children: React.ReactNode;
// }

// // State untuk ErrorBoundary
// interface ErrorBoundaryState {
//   hasError: boolean;
//   error: Error | null;
// }

// // Component untuk chat
// const RealtimeChat: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState<string>("");
//   const [username, setUsername] = useState<string>(`user_${Math.floor(Math.random() * 10000)}`);
//   const [status, setStatus] = useState<string>("disconnected");
//   const [channel, setChannel] = useState<RealtimeChannel | null>(null);

//   useEffect(() => {
//     // Buat channel baru setiap kali komponen di-mount
//     const newChannel = getChannel();
//     setChannel(newChannel);
    
//     // Setup channel listener
//     newChannel
//       .on('broadcast', { event: 'message' }, (payload: Message) => {
//         console.log('Received message:', payload);
//         setMessages((prevMessages) => [...prevMessages, payload]);
//       })
//       .on('presence', { event: 'join' }, ({ newPresences }: { newPresences: PresenceData[] }) => {
//         console.log('User joined:', newPresences);
//       })
//       .on('presence', { event: 'leave' }, ({ leftPresences }: { leftPresences: PresenceData[] }) => {
//         console.log('User left:', leftPresences);
//       })
//       .on('system', { event: 'connection_state_change' }, ({ old, new: newState }: { old: string, new: string }) => {
//         console.log(`Connection state changed from ${old} to ${newState}`);
//         setStatus(newState);
//       });
    
//     // Subscribe ke channel - hanya sekali
//     newChannel.subscribe((status: string) => {
//       console.log('Subscription status:', status);
      
//       if (status === 'SUBSCRIBED') {
//         // Track presence setelah subscribe berhasil
//         newChannel.track({
//           user: username,
//           online_at: new Date().toISOString(),
//         });
//       }
//     });

//     // Cleanup ketika component unmount
//     return () => {
//       if (newChannel) {
//         supabase.removeChannel(newChannel);
//       }
//     };
//   }, []); // Kosong dependency array agar hanya dipanggil sekali saat mount

//   // Update username di presence ketika username berubah
//   useEffect(() => {
//     if (channel && status === 'SUBSCRIBED') {
//       channel.track({
//         user: username,
//         online_at: new Date().toISOString(),
//       });
//     }
//   }, [username, channel, status]);

//   const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !channel) return;

//     // Broadcast message ke semua client yang subscribe
//     channel.send({
//       type: 'broadcast',
//       event: 'message',
//       payload: {
//         username,
//         message: newMessage,
//         timestamp: new Date().toISOString()
//       }
//     });

//     // Clear input field after sending
//     setNewMessage("");
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         <h2>Supabase Realtime Chat</h2>
//         <div className="status">
//           Status: <span className={`status-badge ${status}`}>{status}</span>
//         </div>
//         <div className="username-container">
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Your username"
//           />
//         </div>
//       </div>

//       <div className="messages-container">
//         {messages.length === 0 ? (
//           <div className="no-messages">No messages yet. Be the first to send one!</div>
//         ) : (
//           messages.map((msg, index) => (
//             <div 
//               key={index} 
//               className={`message ${msg.payload.username === username ? 'own-message' : ''}`}
//             >
//               <div className="message-header">
//                 <strong>{msg.payload.username}</strong>
//                 <span className="timestamp">
//                   {new Date(msg.payload.timestamp).toLocaleTimeString()}
//                 </span>
//               </div>
//               <div className="message-content">{msg.payload.message}</div>
//             </div>
//           ))
//         )}
//       </div>

//       <form onSubmit={sendMessage} className="message-input">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message..."
//         />
//         <button type="submit">Send</button>
//       </form>
      
//       {/* ErrorBoundary sederhana */}
//       {status === 'CHANNEL_ERROR' && (
//         <div className="error-message">
//           Terjadi kesalahan pada koneksi. Silakan muat ulang halaman.
//         </div>
//       )}
//     </div>
//   );
// };

// // CSS untuk aplikasi chat
// const styles = `
//   .chat-container {
//     font-family: Arial, sans-serif;
//     max-width: 800px;
//     margin: 0 auto;
//     border: 1px solid #ccc;
//     border-radius: 5px;
//     overflow: hidden;
//     display: flex;
//     flex-direction: column;
//     height: 600px;
//     position: relative;
//   }

//   .chat-header {
//     background-color: #4a69bd;
//     color: white;
//     padding: 15px;
//     display: flex;
//     flex-direction: column;
//   }

//   .chat-header h2 {
//     margin: 0;
//     margin-bottom: 10px;
//   }

//   .status {
//     font-size: 14px;
//     margin-bottom: 10px;
//   }

//   .status-badge {
//     padding: 2px 6px;
//     border-radius: 3px;
//     font-weight: bold;
//   }

//   .status-badge.SUBSCRIBED {
//     background-color: #2ecc71;
//   }

//   .status-badge.TIMED_OUT,
//   .status-badge.CLOSED,
//   .status-badge.disconnected {
//     background-color: #e74c3c;
//   }

//   .status-badge.CHANNEL_ERROR {
//     background-color: #f39c12;
//   }

//   .username-container input {
//     padding: 8px;
//     border: 1px solid #ddd;
//     border-radius: 4px;
//     width: 100%;
//   }

//   .messages-container {
//     flex: 1;
//     padding: 15px;
//     overflow-y: auto;
//     background-color: #f9f9f9;
//   }

//   .no-messages {
//     color: #777;
//     text-align: center;
//     margin-top: 40px;
//   }

//   .message {
//     margin-bottom: 15px;
//     padding: 10px;
//     border-radius: 5px;
//     background-color: #fff;
//     box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
//     max-width: 70%;
//   }

//   .own-message {
//     background-color: #dcf8c6;
//     margin-left: auto;
//   }

//   .message-header {
//     display: flex;
//     justify-content: space-between;
//     margin-bottom: 5px;
//     font-size: 12px;
//   }

//   .timestamp {
//     color: #777;
//   }

//   .message-content {
//     word-break: break-word;
//   }

//   .message-input {
//     display: flex;
//     padding: 10px;
//     background-color: white;
//     border-top: 1px solid #ddd;
//   }

//   .message-input input {
//     flex: 1;
//     padding: 10px;
//     border: 1px solid #ddd;
//     border-radius: 4px;
//     margin-right: 10px;
//   }

//   .message-input button {
//     padding: 10px 15px;
//     background-color: #4a69bd;
//     color: white;
//     border: none;
//     border-radius: 4px;
//     cursor: pointer;
//   }

//   .message-input button:hover {
//     background-color: #3a5aad;
//   }
  
//   .error-message {
//     position: absolute;
//     bottom: 70px;
//     left: 50%;
//     transform: translateX(-50%);
//     background-color: #f8d7da;
//     color: #721c24;
//     padding: 10px 15px;
//     border-radius: 4px;
//     border: 1px solid #f5c6cb;
//     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   }
// `;

// // Main app component dengan ErrorBoundary
// class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
//   constructor(props: ErrorBoundaryProps) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error: Error): ErrorBoundaryState {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
//     console.error("Error caught by boundary:", error, errorInfo);
//   }

//   render(): React.ReactNode {
//     if (this.state.hasError) {
//       return (
//         <div className="error-container">
//           <h2>Oops! Terjadi kesalahan.</h2>
//           <p>{this.state.error?.message || "Terjadi kesalahan yang tidak diketahui."}</p>
//           <button onClick={() => window.location.reload()}>Muat Ulang Halaman</button>
//           <style jsx>{`
//             .error-container {
//               padding: 20px;
//               background-color: #f8d7da;
//               border: 1px solid #f5c6cb;
//               border-radius: 5px;
//               color: #721c24;
//               text-align: center;
//               max-width: 600px;
//               margin: 50px auto;
//             }
            
//             button {
//               background-color: #4a69bd;
//               color: white;
//               padding: 10px 15px;
//               border: none;
//               border-radius: 4px;
//               cursor: pointer;
//               margin-top: 10px;
//             }
//           `}</style>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// const App: React.FC = () => {
//   return (
//     <div className="app">
//       <style>{styles}</style>
//       <ErrorBoundary>
//         <RealtimeChat />
//       </ErrorBoundary>
//     </div>
//   );
// };

// export default App;