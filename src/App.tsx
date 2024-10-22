import { useState } from "react";
import useWebSocket from "./hooks/useWebSocket";
import { v4 } from "uuid";

function App() {
  const VITE_WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_CONSOLE_URL;
  const socketServerUrl = `${VITE_WEBSOCKET_URL}/api/ws`;

  const [isClean, setIsClean] = useState(false);

  const { isOpened, texts, socketRef } = useWebSocket(socketServerUrl, isClean, setIsClean);

  const onClean = () => {
    socketRef.current?.send("clean");

    setIsClean(true);
  };

  return (
    <>
      {isOpened ? <h1>Hello, World!</h1> : <h1>Connecting to server...</h1>}
      <button
        type="button"
        onClick={() =>
          socketRef.current?.send(
            `[${new Date().getTime()},${new Date().getTime()},${new Date().getTime()},${new Date().getTime()}]`
          )
        }
      >
        Send
      </button>
      <button type="button" onClick={() => onClean()}>
        Clean
      </button>
      {texts.map((text) => (
        <p key={v4()}>{text}</p>
      ))}
    </>
  );
}

export default App;
