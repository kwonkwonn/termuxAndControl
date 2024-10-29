import React, { useState } from "react";

const MobileChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isPressed, setIsPressed] = useState(false);

  const handleButtonPress = async () => {
    if (!isPressed) {
      try {
        setIsPressed(true);
        await fetch("https://localhost:3000/chatVoice");
      } catch (err) {
        console.log("Error starting recording:", err);
      }
    } else {
      setIsPressed(false);
      try {
        const userResponse = await fetch("https://localhost:3000/quitChat");
        const reader = userResponse.body.getReader();
        const decoder = new TextDecoder("utf-8");

        let userMessage = "",
          aiMessage = "";
        let readUser = true;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (readUser) {
            userMessage += chunk;
            readUser = false;
          } else {
            aiMessage += chunk;
          }
        }

        setMessages((prev) => [
          ...prev,
          { type: "user", content: userMessage },
          { type: "ai", content: aiMessage },
        ]);
      } catch (error) {
        console.error("Error stopping recording or fetching response:", error);
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
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          {isPressed ? "Stop Recording" : "Send Message"}
        </button>
      </div>
    </div>
  );
};

export default MobileChatInterface;
