import React, { useState } from "react";

const MobileChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isPressed, setIsPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonPress = async () => {
    if (!isPressed) {
      try {
        setIsPressed(true);
        const response = await fetch("https://localhost:3000/chatVoice");
        if (!response.ok) {
          throw new Error("Failed to start recording");
        }
      } catch (err) {
        console.error("Error starting recording:", err);
        setIsPressed(false);
      }
    } else {
      setIsPressed(false);
      setIsLoading(true);

      try {
        const response = await fetch("https://localhost:3000/quitChat");
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const messages = chunk.split("\n").filter(Boolean);

          for (const messageStr of messages) {
            try {
              const message = JSON.parse(messageStr);
              if (message.type === "error") {
                console.error("Server error:", message.content);
                continue;
              }
              setMessages((prev) => [...prev, message]);
            } catch (e) {
              console.error("Error parsing message:", e);
            }
          }
        }
      } catch (error) {
        console.error("Error processing response:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <header className="text-center text-xl font-bold mb-4">Helper Pat</header>
      <div className="flex-grow overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[60%] p-3 rounded-lg ${
              message.type === "user"
                ? "bg-green-200 self-end text-right"
                : "bg-gray-200 self-start text-left"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <button
          onClick={handleButtonPress}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md transition duration-300 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isLoading
            ? "Processing..."
            : isPressed
            ? "Stop Recording"
            : "Send Message"}
        </button>
      </div>
    </div>
  );
};

export default MobileChatInterface;
