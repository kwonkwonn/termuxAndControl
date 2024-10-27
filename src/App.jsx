import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useMediaQuery } from "react-responsive";
import Chat from "./module/mainBox";

function App() {
  const isPC = useMediaQuery({
    query: "(min-width:1024px)",
  });
  const isMobile = useMediaQuery({
    query: "(min-width:767px) and (max-width:1023px)",
  });
  const [count, setCount] = useState(0);

  return (
    <div>
      <Chat></Chat>
    </div>
  );
}

export default App;
