export async function fetchCoinGeckoHistory(
  coinId = "bitcoin",
  vsCurrency = "usd",
  days = 30
) {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch CoinGecko data");
  const data = await res.json();
  // data.prices: [[timestamp, price], ...]
  // data.total_volumes: [[timestamp, volume], ...]
  const result = data.prices.map(([ts, price], i) => {
    const date = new Date(ts).toISOString().slice(0, 10);
    const prevPrice = i > 0 ? data.prices[i - 1][1] : price;
    const performance = ((price - prevPrice) / prevPrice) * 100;
    // Volatility: stddev of last 5 days' prices
    const window = data.prices
      .slice(Math.max(0, i - 4), i + 1)
      .map(([, p]) => p);
    const mean = window.reduce((a, b) => a + b, 0) / window.length;
    const variance =
      window.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / window.length;
    const volatility = Math.sqrt(variance) / mean;
    const volume = data.total_volumes[i][1];
    return {
      date,
      price,
      volume,
      performance: +performance.toFixed(2),
      volatility: +volatility.toFixed(3),
    };
  });
  return result;
}
