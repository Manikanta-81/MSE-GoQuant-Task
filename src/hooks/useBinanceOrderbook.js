import { useEffect, useRef, useState } from 'react';

export default function useBinanceOrderbook(symbol = 'btcusdt') {
  const ws = useRef(null);
  const [orderbook, setOrderbook] = useState({ bids: [], asks: [], lastUpdateId: null });

  useEffect(() => {
    const BINANCE_WS_URL = `wss://stream.binance.com:9443/ws/${symbol}@depth`;
    ws.current = new window.WebSocket(BINANCE_WS_URL);
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setOrderbook({
        bids: data.bids || [],
        asks: data.asks || [],
        lastUpdateId: data.u || null,
      });
    };
    return () => {
      if (ws.current) ws.current.close();
    };
  }, [symbol]);

  return orderbook;
} 