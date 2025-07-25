import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { useMergedOrderbook } from '../../api/binanceOrderbook';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Alert from '@mui/material/Alert';
import './Dashboard.css';

const Dashboard = ({ asset, setAsset, assets }) => {
  const { calendarData, selectedDate } = useContext(DataContext);
  const { binance, label } = asset;
  const { bids, asks, loading, error } = useMergedOrderbook(binance, 10);
  const day = calendarData.find(d => d.date === selectedDate);

  if (!day)
    return (
      <Card className="dashboard-panel" elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" color="text.secondary">
              Select a date on the calendar to see details
            </Typography>
            {assets && setAsset && (
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="asset-select-label">Asset</InputLabel>
                <Select
                  labelId="asset-select-label"
                  id="asset-select"
                  value={label}
                  label="Asset"
                  onChange={e => {
                    const selected = assets.find(a => a.label === e.target.value);
                    setAsset(selected);
                  }}
                >
                  {assets.map(a => (
                    <MenuItem key={a.label} value={a.label}>{a.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </CardContent>
      </Card>
    );

  const perfIcon = day.performance > 0 ? (
    <ArrowUpwardIcon style={{ color: 'green', fontSize: 22, verticalAlign: 'middle' }} />
  ) : day.performance < 0 ? (
    <ArrowDownwardIcon style={{ color: 'red', fontSize: 22, verticalAlign: 'middle' }} />
  ) : (
    <TrendingFlatIcon style={{ color: '#888', fontSize: 22, verticalAlign: 'middle' }} />
  );

  return (
    <Card className="dashboard-panel" elevation={3} sx={{ p: 3, borderRadius: 3, minHeight: 420 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Historical Data for {day.date}
          </Typography>
          {assets && setAsset && (
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel id="asset-select-label">Asset</InputLabel>
              <Select
                labelId="asset-select-label"
                id="asset-select"
                value={label}
                label="Asset"
                onChange={e => {
                  const selected = assets.find(a => a.label === e.target.value);
                  setAsset(selected);
                }}
              >
                {assets.map(a => (
                  <MenuItem key={a.label} value={a.label}>{a.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Price</Typography>
            <Typography variant="h5">${day.price}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Performance</Typography>
            <Typography variant="h5">
              {day.performance}% {perfIcon}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Volatility</Typography>
            <Typography variant="h5">{Math.round(day.volatility * 100)}%</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Volume</Typography>
            <Typography variant="h5">{day.volume.toLocaleString()}</Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }} color="primary">
          Live Orderbook (Binance)
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Orderbook data is <b>live</b> for the selected symbol and is not historical.
        </Alert>
        {loading && <div>Loading orderbook...</div>}
        {error && <div style={{ color: 'red' }}>Error: {error}</div>}
        {!loading && !error && (
          <Box sx={{ display: 'flex', gap: 4, mt: 1 }}>
            <Box>
              <Typography variant="caption" color="success.main">Bids</Typography>
              <ul style={{ fontSize: '0.95rem', padding: 0, listStyle: 'none' }}>
                {bids.map(([price, qty], idx) => (
                  <li key={idx} style={{ color: 'green' }}>{price} ({qty})</li>
                ))}
              </ul>
            </Box>
            <Box>
              <Typography variant="caption" color="error.main">Asks</Typography>
              <ul style={{ fontSize: '0.95rem', padding: 0, listStyle: 'none' }}>
                {asks.map(([price, qty], idx) => (
                  <li key={idx} style={{ color: 'red' }}>{price} ({qty})</li>
                ))}
              </ul>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard; 