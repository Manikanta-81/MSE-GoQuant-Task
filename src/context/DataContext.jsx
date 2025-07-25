import React, { createContext, useEffect, useState } from 'react';
import { fetchCoinGeckoHistory } from '../api/coingecko';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchCoinGeckoHistory('bitcoin', 'usd', 30)
      .then(data => {
        setCalendarData(data);
        setLoading(false);
        if (data.length) setSelectedDate(data[data.length - 1].date);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <DataContext.Provider value={{ calendarData, loading, error, selectedDate, setSelectedDate }}>
      {children}
    </DataContext.Provider>
  );
};
