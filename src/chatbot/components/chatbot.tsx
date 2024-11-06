import React, { useState } from "react";
import "../../../src/chatbot/styles/chatbot.css";
import { RiRobot3Fill, RiSendPlane2Fill, RiCloseFill } from "react-icons/ri";
import { IconButton } from "@mui/material";

interface ChatMessage {
  text: string;
  isUser: boolean;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user's message to the chat
    const userMessage: ChatMessage = { text: inputValue, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Generate a response from the bot
    const botResponse: ChatMessage = {
      text: generateResponse(inputValue),
      isUser: false,
    };
    setMessages((prevMessages) => [...prevMessages, botResponse]);

    // Clear the input
    setInputValue("");
  };

  const generateResponse = (userInput: string): string => {
    const responses: { [key: string]: string } = {
      hello: "Hi there! How can I assist you?",
      help: "Sure! What do you need help with?",
      bye: "Goodbye! Have a great day!",
    };

    const lowerInput = userInput.toLowerCase();

    return (
      responses[lowerInput as keyof typeof responses] ||
      "I'm sorry, I don't understand."
    );
  };

  return (
    <>
      <div className="chat-icon" onClick={toggleChat}>
        <RiRobot3Fill size={36} color="#2C6A9B" />
      </div>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <p>Chatbot</p>
            <IconButton onClick={toggleChat} className="close-chat-icon">
              <RiCloseFill size={20} />
            </IconButton>
          </div>
          <div className="chat-content">
            {messages.map((msg, index) => (
              <p
                key={index}
                className={msg.isUser ? "user-message" : "bot-message"}
              >
                {msg.text}
              </p>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
            />

            <IconButton
              color="primary"
              onClick={handleSendMessage}
              className="chat-input-btn"
            >
              <RiSendPlane2Fill />
            </IconButton>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
