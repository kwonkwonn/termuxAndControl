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
        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // 버퍼에 남은 데이터 처리
            if (buffer) {
              try {
                const message = JSON.parse(buffer);
                setMessages((prev) => [...prev, message]);
              } catch (e) {
                console.error("Error parsing remaining buffer:", e);
              }
            }
            break;
          }

          // 새로운 청크를 버퍼에 추가
          buffer += decoder.decode(value, { stream: true });

          // 완전한 JSON 객체들을 찾아서 처리
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // 마지막 불완전한 라인은 버퍼에 저장

          for (const line of lines) {
            if (line.trim()) {
              try {
                const message = JSON.parse(line);
                console.log("Received message:", message); // 디버깅용
                setMessages((prev) => [...prev, message]);
              } catch (e) {
                console.error("Error parsing message:", e, "Line:", line);
              }
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
                ? "bg-green-200 self-end ml-auto" // ml-auto 추가
                : "bg-gray-200 self-start"
            }`}
          >
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
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
