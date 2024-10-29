import React, { useState, useEffect, useRef } from "react";

const MobileChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isPressed, setIsPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 자동 스크롤 기능
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleRobot = async (command) => {
    try {
      const response = fetch("http://localhost:3000/user/robotControl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command: command,
          text: "hello",
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleButtonPress = async () => {
    if (!isPressed) {
      try {
        setIsPressed(true);
        const response = await fetch("http://localhost:3000/chat/chatVoice");
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
        const response = await fetch("http://localhost:3000/chat/quitChat");
        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value);
          const messages = chunk.split("\n").filter((line) => line.trim());

          for (const message of messages) {
            try {
              const parsedMessage = JSON.parse(message);
              setMessages((prev) => [...prev, parsedMessage]);
            } catch (e) {
              console.error("파싱 에러:", e);
            }
          }
        }
      } catch (error) {
        console.error("응답 처리 에러:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <header className="text-center text-xl font-bold mb-4 bg-yellow-100 border">
        Helper Pat
      </header>
      <div className="flex-grow overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[60%] p-3 rounded-lg ${
              message.type === "user"
                ? "bg-green-200 self-end ml-auto" // ml-auto 추가
                : "bg-gray-200 self-start"
            }`}
          >
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 text-center gap-4 flex justify-center">
        <div>
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
        <div>
          <button
            className="px-4 py-2 rounded-md transition duration-300 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => {
              handleRobot("moveRobot");
            }}
          >
            moveRobot
          </button>
        </div>
        <div>
          <button
            className="px-4 py-2 rounded-md transition duration-300 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => {
              handleRobot("rotate");
            }}
          >
            rotate
          </button>
        </div>
        <div>
          <button
            className="px-4 py-2 rounded-md transition duration-300 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => {
              handleRobot("sit");
            }}
          >
            sit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileChatInterface;
