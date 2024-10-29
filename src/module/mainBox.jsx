import React, { useState } from "react";

const MobileChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isPressed, setIsPressed] = useState(false);

  const handleButtonPress = async () => {
    if (isPressed.valueOf(false)) {
      try {
        setIsPressed(true);
        const userResponse = await fetch("https://localhost:3000/chatVoice");
      } catch (err) {
        console.log("err:", err);
      }
    } else {
      setIsPressed(false);
      try {
        const userResponse = await fetch("https://localhost:3000/quitChat");
        const userData = await userResponse.json();
        try {
          setMessages((prev) => [
            {
              type: "user",
              content: userData.message,
            },
          ]);
        } catch (err) {
          console.error("Error:", error);
        }
        const aiResponse = await fetch("/your-ai-endpoint");
        aiData = await aiResponse.json();
        userData = await userResponse.json();

        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: aiData.message,
          },
        ]);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    // 전체 컨테이너를 viewport 높이로 고정하고 flex 레이아웃 사용
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-gray-50">
      {/* 헤더 - 고정 높이 */}
      <div className="bg-green-100 px-4 py-3 shadow-sm">
        <h1 className="text-base font-32px">Helper pat</h1>
      </div>

      {/* 채팅 영역 - 남은 공간 모두 차지 */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "ai" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg ${
                  message.type === "ai"
                    ? "bg-blue-100 text-left"
                    : "bg-blue-200 text-right"
                }`}
              >
                <p className="text-sm break-words">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 버튼 영역 - 하단에 고정 */}
      <div className="bg-green-100 px-4 py-3 shadow-t">
        <div className="flex justify-center items-center">
          <button
            onClick={handleButtonPress}
            disabled={isPressed}
            className={`w-14 h-14 rounded-full transition-colors duration-200 focus:outline-none active:scale-95 ${
              isPressed ? "bg-red-800" : "bg-red-600"
            }`}
            style={{
              // Safari에서의 하이라이트 제거
              WebkitTapHighlightColor: "transparent",
              // 더블탭 줌 방지
              touchAction: "manipulation",
            }}
          >
            <span className="sr-only">Send Message</span>
          </button>
        </div>
      </div>

      {/* iOS Safari에서 하단 안전 영역 확보 */}
      <div className="h-safe-bottom bg-green-100" />
    </div>
  );
};

export default MobileChatInterface;
