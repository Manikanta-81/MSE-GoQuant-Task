import React, { useState, useEffect } from "react";
import Calendar from "../components/Calendar/Calendar";
import Dashboard from "../components/Dashboard/Dashboard";
import Header from "../components/Shared/Header";
import Footer from "../components/Shared/Footer";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const ASSETS = [
  { label: "BTC", coingecko: "bitcoin", binance: "btcusdt", img: process.env.PUBLIC_URL + "/bitcoin.png" },
  { label: "ETH", coingecko: "ethereum", binance: "ethusdt", img: process.env.PUBLIC_URL + "/eth.png" },
  { label: "BNB", coingecko: "binancecoin", binance: "bnbusdt", img: process.env.PUBLIC_URL + "/bnb.png" },
];

const Home = () => {
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [showTip, setShowTip] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(true);
  const [imgKey, setImgKey] = useState(0);
  const [showSplash, setShowSplash] = useState(true);

  const handleAssetChange = (asset) => {
    setImgLoaded(false);
    setImgKey(k => k + 1);
    setTimeout(() => {
      setSelectedAsset(asset);
      setImgLoaded(true);
    }, 200); 
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#f5f5f5' }}>
      {showSplash && (
        <div style={{
          position: 'fixed',
          zIndex: 9999,
          top: 0, left: 0, right: 0, bottom: 0,
          background: '#111',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          transition: 'opacity 0.5s',
        }}>
          <img
            src={selectedAsset.img}
            alt={selectedAsset.label}
            style={{ width: 80, height: 80, borderRadius: 16, marginBottom: 24, boxShadow: '0 0 32px #1976d2' }}
          />
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 600, letterSpacing: 1 }}>Loading Market Seasonality Explorer... using Binance API</div>
        </div>
      )}
      <Header />
      <main
        className="flex-grow flex items-center justify-center"
        style={{
          minHeight: 'calc(100vh - 120px)',
          width: '100%',
          padding: 0,
          opacity: showSplash ? 0.2 : 1,
          transition: 'opacity 0.5s',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            minHeight: '70vh',
            padding: '24px 0',
          }}
        >
          <div style={{
            background: '#e3f2fd',
            borderRadius: 12,
            padding: '18px 24px',
            marginBottom: 24,
            maxWidth: 900,
            width: '100%',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.07)',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontSize: 16,
            transition: 'box-shadow 0.3s',
          }}>
            <div style={{ position: 'relative', width: 44, height: 44 }}>
              <img
                key={imgKey}
                src={selectedAsset.img}
                alt={selectedAsset.label}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: '#fff',
                  border: '1px solid #b3d1f7',
                  padding: 2,
                  opacity: imgLoaded ? 1 : 0.3,
                  transform: imgLoaded ? 'scale(1)' : 'scale(0.8)',
                  transition: 'opacity 0.4s, transform 0.4s',
                  boxShadow: imgLoaded ? '0 0 8px 2px #1976d2aa' : 'none',
                }}
                onLoad={() => setImgLoaded(true)}
              />
              {!imgLoaded && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, width: 38, height: 38,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#e3f2fd', borderRadius: 8, fontSize: 12, color: '#1976d2',
                }}>
                  Loading...
                </div>
              )}
            </div>
            
            <div>
              <b>Market Seasonality Explorer</b> lets you visualize historical volatility, liquidity, and performance for <b>{selectedAsset.label}</b>.<br/>
              <span style={{ color: '#1976d2' }}>Switch between daily, weekly, and monthly views. Click any cell for detailed metrics and live orderbook data. Use the asset selector to explore BTC, ETH, or BNB.</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%', maxWidth: 900, marginBottom: 12 }}>
            <label htmlFor="asset-select" style={{ fontWeight: 500, marginRight: 8 }}>Asset:</label>
            <select
              id="asset-select"
              value={selectedAsset.label}
              onChange={e => handleAssetChange(ASSETS.find(a => a.label === e.target.value))}
              style={{ padding: '6px 12px', borderRadius: 6, fontSize: 16, transition: 'box-shadow 0.2s' }}
            >
              {ASSETS.map(a => (
                <option key={a.label} value={a.label}>{a.label}</option>
              ))}
            </select>
          </div>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
              width: '100%',
              alignItems: 'stretch',
              opacity: imgLoaded ? 1 : 0.5,
              transition: 'opacity 0.4s',
            }}
            className="dashboard-calendar-row"
          >
            <div style={{ width: '100%' }}>
              <Calendar asset={selectedAsset} />
            </div>
            <div style={{ width: '100%' }}>
              <Dashboard asset={selectedAsset} setAsset={setSelectedAsset} assets={ASSETS} />
            </div>
          </div>
        </div>

        <Snackbar open={showTip} autoHideDuration={5000} onClose={() => setShowTip(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <MuiAlert elevation={6} variant="filled" onClose={() => setShowTip(false)} severity="info">
            Tip: Click any cell for details and live data. Use the asset selector to explore BTC, ETH, or BNB.
          </MuiAlert>
        </Snackbar>
      </main>
      <Footer />
      <style>{`
        @media (min-width: 900px) {
          .dashboard-calendar-row {
            flex-direction: row;
            justify-content: center;
            align-items: flex-start;
            gap: 48px;
          }
          .dashboard-calendar-row > div {
            width: 100%;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
