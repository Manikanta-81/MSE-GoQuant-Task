import { useEffect, useRef, useState } from "react";
const BINANCE_REST_URL = "https://api.binance.com/api/v3/depth";


export function useMergedOrderbook(symbol = "btcusdt", limit = 10) {
  const ws = useRef(null);
  const [orderbook, setOrderbook] = useState({
    bids: [],
    asks: [],
    loading: true,
    error: null,
  });
  const lastUpdateId = useRef(null);
  const buffer = useRef([]);

  useEffect(() => {
    let isMounted = true;
    setOrderbook({ bids: [], asks: [], loading: true, error: null });
    lastUpdateId.current = null;
    buffer.current = [];

    // Fetch REST snapshot
    fetch(`${BINANCE_REST_URL}?symbol=${symbol.toUpperCase()}&limit=100`)
      .then((res) => res.json())
      .then((snapshot) => {
        if (!isMounted) return;
        lastUpdateId.current = snapshot.lastUpdateId;
        setOrderbook({
          bids: snapshot.bids.slice(0, limit),
          asks: snapshot.asks.slice(0, limit),
          loading: false,
          error: null,
        });


        // Apply any buffered WS updates
        buffer.current.forEach((update) => {
          if (update.u > lastUpdateId.current) {
            applyUpdate(update);
          }
        });
        buffer.current = [];
      })
      .catch((err) => {
        if (isMounted)
          setOrderbook({
            bids: [],
            asks: [],
            loading: false,
            error: err.message,
          });
      });

    // Connect to WebSocket
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol}@depth`;
    ws.current = new window.WebSocket(wsUrl);
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (!lastUpdateId.current) {
        // Buffer updates until snapshot is loaded
        buffer.current.push(data);
      } else if (data.u > lastUpdateId.current) {
        applyUpdate(data);
      }
    };

    function applyUpdate(update) {
      setOrderbook((prev) => {
        // Merge bids
        let bids = mergeLevels(prev.bids, update.b);
        let asks = mergeLevels(prev.asks, update.a);
        return {
          ...prev,
          bids: bids.slice(0, limit),
          asks: asks.slice(0, limit),
        };
      });
      lastUpdateId.current = update.u;
    }

    function mergeLevels(levels, updates) {
      const map = new Map(levels.map(([price, qty]) => [price, qty]));
      updates.forEach(([price, qty]) => {
        if (parseFloat(qty) === 0) {
          map.delete(price);
        } else {
          map.set(price, qty);
        }
      });
      // Sort: bids desc, asks asc
      const sorted = Array.from(map.entries()).sort(
        (a, b) => parseFloat(b[0]) - parseFloat(a[0])
      );
      return sorted;
    }

    return () => {
      isMounted = false;
      if (ws.current) ws.current.close();
    };
  }, [symbol, limit]);

  return orderbook;
}
