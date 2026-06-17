import React, { useState } from "react";
import axios from "axios";
import "./ChatBot.css";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you?" }
  ]);

  const toggleChat = () => {
    setOpen(!open);
  };

  // ✅ NEW: Quick reply sender
  const sendQuick = async (text) => {
    const userMsg = { sender: "user", text: text };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await axios.post("https://volunteer-hub-jp64.onrender.com/api/chat", {
        message: text
      });

      // ✅ Typing delay effect
      setTimeout(() => {
        const botMsg = { sender: "bot", text: res.data.reply };
        setMessages(prev => [...prev, botMsg]);
      }, 600);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Server error. Please try again." }
      ]);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await axios.post("https://volunteer-hub-jp64.onrender.com/api/chat", {
        message: message
      });

      // ✅ Typing delay effect
      setTimeout(() => {
        const botMsg = { sender: "bot", text: res.data.reply };
        setMessages(prev => [...prev, botMsg]);
      }, 600);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Server error. Please try again." }
      ]);
    }

    setMessage("");
  };

  return (
    <div>
      {/* Floating Button */}
      <button className="chat-toggle" onClick={toggleChat}>
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            VolunteerHub Assistant
            <button onClick={toggleChat}>✖</button>
          </div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* ✅ NEW: Quick Reply Buttons */}
          <div className="quick-replies">
            <button onClick={() => sendQuick("available events")}>
              Available Events
            </button>
            <button onClick={() => sendQuick("how to apply")}>
              How to Apply
            </button>
            <button onClick={() => sendQuick("my certificates")}>
              My Certificates
            </button>
            <button onClick={() => sendQuick("contact support")}>
              Contact Support
            </button>
          </div>

          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
