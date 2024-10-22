import { useEffect, useRef, useState } from "react";

const useWebSocket = (url: string, isClean: boolean, setIsClean: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [isOpened, setIsOpened] = useState(false);
  const [texts, setTexts] = useState<string[]>([]);
  const socketRef = useRef<WebSocket>();

  useEffect(() => {
    if (isClean) {
      setTexts([]);
      setIsClean(false);
    }
  }, [isClean, setIsClean]);

  useEffect(() => {
    const ws = new WebSocket(url);
    socketRef.current = ws;

    // 接続したかどうかを確認
    ws.onopen = () => {
      setIsOpened(true);
    };

    const onMessage = (event: MessageEvent) => {
      // data が文字列であるか確認
      if (typeof event.data === "string") {
        // data を文字列の配列に変換して state にセット
        const strs: string[] = JSON.parse(event.data);
        setTexts((prev) => [...prev, ...strs]);
        strs.map((str) => console.log(str));
      } else {
        console.error("Invalid data type");
      }
    };
    ws.addEventListener("message", onMessage);

    const onClose = () => {
      const ws = new WebSocket(url);
      socketRef.current = ws;
      console.log("Reconnecting to server...");
    };
    ws.addEventListener("close", onClose);

    return () => {
      ws.close();
    };
  }, [url]);

  return { isOpened, texts, socketRef };
};

export default useWebSocket;
