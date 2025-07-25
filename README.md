# Market Seasonality Explorer

A professional, interactive React app for visualizing historical volatility, liquidity, and performance of financial instruments—optimized for crypto assets. Explore daily, weekly, and monthly seasonality patterns with a beautiful calendar UI, live Binance orderbook, and rich dashboard.

---

## 📦 Repository

> https://github.com/Manikanta-81/MSE-GoQuant-Task

---

## ✨ Features

### 📅 Interactive Calendar View
- **Daily, Weekly, Monthly Views:** Switch between granular and aggregated timeframes.
- **Heatmap Coloring:** Visualizes volatility and performance with color-coded cells.
- **Tooltips:** Hover/click for detailed stats (price, volatility, performance, volume).
- **Keyboard Navigation & Accessibility:** Navigate cells with keyboard, ARIA labels, and focus management.
- **Responsive Design:** Mobile-friendly with adaptive grid and tooltips.
- **Smooth Animations:** Animated transitions for cell selection, asset changes, and splash screen.

### 📊 Dashboard Panel
- **Detailed Metrics:** Shows price, performance, volatility, and volume for the selected date/period.
- **Live Binance Orderbook:** Real-time bids/asks for the selected asset (BTC, ETH, BNB).
- **Asset Selector:** Instantly switch between supported assets with animated icons.

### 🔄 Real-Time & Historical Data
- **Binance API:** Live orderbook via REST snapshot + WebSocket updates.
- **CoinGecko API:** 30-day historical price, volume, and volatility data.
- **Automatic Data Aggregation:** Weekly/monthly stats are computed on the fly.

### 🛠️ Filters & Export
- **(Planned) Filters:** By asset, sector, security, and date range.
- **Export to CSV:** Download calendar data for any view (daily/weekly/monthly).
- **(Planned) Export to PDF/Image:** For reports and sharing.

### 🧑‍💻 Developer Experience
- **Modular Components:** Clean, reusable React components (Calendar, Dashboard, Filters, etc).
- **Context API State Management:** Centralized data, loading, and selection state.
- **Hooks:** Custom hooks for API integration and calendar logic.
- **Unit Tests:** (Planned) for critical components and logic.

### 🧩 Enhanced UX
- **Loading Splash Screen:** Animated asset image and app title on load.
- **Welcome Snackbar:** Tips for new users.
- **Asset Images:** Visual cues for each crypto asset.
- **Accessibility:** ARIA labels, keyboard support, and focus management.

---

## 🗂️ Project Structure

```
market-seasonality-explorer/
  ├── public/                # Static assets (icons, manifest, images)
  ├── src/
  │   ├── components/
  │   │   ├── Calendar/      # Calendar grid, cell, and styles
  │   │   ├── Dashboard/     # Dashboard panel and details
  │   │   ├── Filters/       # (Planned) Filter bar and selectors
  │   │   └── Shared/        # Header, Footer, Loader, Tooltip
  │   ├── context/           # DataContext for state management
  │   ├── api/               # Binance & CoinGecko API logic
  │   ├── hooks/             # Custom React hooks
  │   ├── pages/             # Home page layout
  │   ├── styles/            # Global and component CSS
  │   ├── utils/             # Helpers and constants
  │   └── tests/             # Unit tests (WIP)
  ├── package.json           # Dependencies and scripts
  └── README.md              # This file
```

---

## ⚙️ How It Works

- **Calendar:** Renders a heatmap grid for the latest month, with daily, weekly, and monthly aggregation. Each cell is interactive, accessible, and color-coded by volatility.
- **Dashboard:** Shows detailed stats for the selected date/period, plus a live Binance orderbook for the chosen asset.
- **DataContext:** Centralizes calendar data, loading/error state, and selected date. Fetches CoinGecko data on load.
- **API Integration:**
  - *CoinGecko:* Fetches 30-day historical price, volume, and computes volatility/performance.
  - *Binance:* Fetches orderbook snapshot (REST) and merges live updates (WebSocket) for real-time depth.
- **Export:** One-click CSV export for any calendar view.
- **Accessibility:** All interactive elements are keyboard-accessible and screen-reader friendly.

---

## 🏁 Getting Started

### 1. Clone the Repository

```bash
git clone <https://github.com/Manikanta-81/MSE-GoQuant-Task>
cd market-seasonality-explorer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
```

---

## 🧑‍💻 Usage
- **Switch Views:** Use the Daily/Weekly/Monthly buttons above the calendar.
- **Select Asset:** Use the dropdown to switch between BTC, ETH, and BNB.
- **View Details:** Click any calendar cell for detailed stats and live orderbook.
- **Export Data:** Click "Export CSV" to download the current view.
- **Keyboard Navigation:** Tab/arrow through cells, press Enter/Space to select.
- **Responsive:** Works on desktop, tablet, and mobile.

---

## 🤝 Acknowledgements
- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Recharts](https://recharts.org/)
- [Binance API](https://binance-docs.github.io/apidocs/spot/en/)
- [CoinGecko API](https://www.coingecko.com/en/api)
- [file-saver](https://github.com/eligrey/FileSaver.js/)

---

## 📄 License
[MIT] (or specify your license here)

---
