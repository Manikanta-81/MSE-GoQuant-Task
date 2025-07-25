import React, { useContext } from 'react';
import CalendarCell from '../Calendar/CalendarCell';
import { DataContext } from '../../context/DataContext';
import { ButtonGroup, Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import './Styles.css';
import { saveAs } from 'file-saver';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function getLatestMonthMatrix(calendarData) {
  if (!calendarData.length) return [];
  const latest = new Date(calendarData[calendarData.length - 1].date);
  const year = latest.getFullYear();
  const month = latest.getMonth();
  const monthDays = calendarData.filter(d => {
    const dDate = new Date(d.date);
    return dDate.getFullYear() === year && dDate.getMonth() === month;
  });
  const dayMap = Object.fromEntries(monthDays.map(d => [d.date, d]));
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const startDay = firstOfMonth.getDay();
  const daysInMonth = lastOfMonth.getDate();
  const weeks = [];
  let week = [];
  for (let i = 0; i < startDay; i++) week.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = new Date(year, month, day).toISOString().slice(0, 10);
    week.push(dayMap[dateStr] || { date: dateStr });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

function getWeeklyAggregates(calendarData) {
  if (!calendarData.length) return [];
  const latest = new Date(calendarData[calendarData.length - 1].date);
  const year = latest.getFullYear();
  const month = latest.getMonth();
  const monthDays = calendarData.filter(d => {
    const dDate = new Date(d.date);
    return dDate.getFullYear() === year && dDate.getMonth() === month;
  });
  const weeks = [];
  let week = [];
  let lastWeekStart = null;
  monthDays.forEach(day => {
    const d = new Date(day.date);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const weekStartStr = weekStart.toISOString().slice(0, 10);
    if (lastWeekStart !== null && weekStartStr !== lastWeekStart) {
      weeks.push(week);
      week = [];
    }
    week.push(day);
    lastWeekStart = weekStartStr;
  });
  if (week.length) weeks.push(week);
  // Aggregate and label
  return weeks.map((days, idx) => {
    const validPerf = days.map(d => d.performance).filter(v => typeof v === 'number');
    const validVol = days.map(d => d.volatility).filter(v => typeof v === 'number');
    const validPrice = days.map(d => d.price).filter(v => typeof v === 'number');
    const validVolu = days.map(d => d.volume).filter(v => typeof v === 'number');
    const avgPerformance = validPerf.length ? validPerf.reduce((a, b) => a + b, 0) / validPerf.length : null;
    const avgVolatility = validVol.length ? validVol.reduce((a, b) => a + b, 0) / validVol.length : null;
    const totalVolume = validVolu.length ? validVolu.reduce((a, b) => a + b, 0) : null;
    const avgPrice = validPrice.length ? validPrice.reduce((a, b) => a + b, 0) / validPrice.length : null;
    return {
      date: `Week ${idx + 1}`,
      weekRange: days[0].date + ' - ' + days[days.length - 1].date,
      days,
      performance: avgPerformance !== null ? +avgPerformance.toFixed(2) : null,
      volatility: avgVolatility !== null ? +avgVolatility.toFixed(3) : null,
      volume: totalVolume !== null ? Math.round(totalVolume) : null,
      price: avgPrice !== null ? +avgPrice.toFixed(2) : null,
      isAggregate: true,
    };
  });
}

function getMonthlyAggregate(calendarData) {
  if (!calendarData.length) return [];
  const latest = new Date(calendarData[calendarData.length - 1].date);
  const year = latest.getFullYear();
  const month = latest.getMonth();
  const monthDays = calendarData.filter(d => {
    const dDate = new Date(d.date);
    return dDate.getFullYear() === year && dDate.getMonth() === month;
  });
  const validPerf = monthDays.map(d => d.performance).filter(v => typeof v === 'number');
  const validVol = monthDays.map(d => d.volatility).filter(v => typeof v === 'number');
  const validPrice = monthDays.map(d => d.price).filter(v => typeof v === 'number');
  const validVolu = monthDays.map(d => d.volume).filter(v => typeof v === 'number');
  const avgPerformance = validPerf.length ? validPerf.reduce((a, b) => a + b, 0) / validPerf.length : null;
  const avgVolatility = validVol.length ? validVol.reduce((a, b) => a + b, 0) / validVol.length : null;
  const totalVolume = validVolu.length ? validVolu.reduce((a, b) => a + b, 0) : null;
  const avgPrice = validPrice.length ? validPrice.reduce((a, b) => a + b, 0) / validPrice.length : null;
  return [{
    date: MONTH_NAMES[month],
    monthRange: monthDays[0]?.date + ' - ' + monthDays[monthDays.length - 1]?.date,
    days: monthDays,
    performance: avgPerformance !== null ? +avgPerformance.toFixed(2) : null,
    volatility: avgVolatility !== null ? +avgVolatility.toFixed(3) : null,
    volume: totalVolume !== null ? Math.round(totalVolume) : null,
    price: avgPrice !== null ? +avgPrice.toFixed(2) : null,
    isAggregate: true,
  }];
}

//convert array of objects to CSV
function toCSV(data, view) {
  if (!data.length) return '';
  const keys = Object.keys(data[0]);
  const header = keys.join(',');
  const rows = data.map(row => keys.map(k => row[k] ?? '').join(','));
  return [header, ...rows].join('\n');
}

const Calendar = ({ asset }) => {
  const { calendarData, loading, error, setSelectedDate } = useContext(DataContext);
  const [view, setView] = React.useState('daily');

  let content;
  if (view === 'daily') {
    const weeks = getLatestMonthMatrix(calendarData);
    content = weeks.map((week, i) => (
      <React.Fragment key={i}>
        <div className="calendar-week-label" style={{ fontWeight: 600, fontSize: 13, margin: '8px 0 2px 2px', color: '#1976d2', letterSpacing: 1 }}>
          Week {i + 1}
        </div>
        <div className="calendar-week" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginBottom: '8px' }}>
          {week.map((day, j) =>
            day ? <CalendarCell key={day.date} day={day} view={view} /> : <div key={j} className="cell empty" />
          )}
        </div>
      </React.Fragment>
    ));
  } else if (view === 'weekly') {
    const weeks = getWeeklyAggregates(calendarData);
    const rows = [];
    for (let i = 0; i < weeks.length; i += 4) {
      rows.push(weeks.slice(i, i + 4));
    }
    content = rows.map((row, i) => (
      <div className="calendar-week" key={i} style={{ display: 'flex', flexDirection: 'row', gap: '10px', marginBottom: '8px', justifyContent: 'center' }}>
        {row.map((week, j) => (
          <CalendarCell key={week.date} day={week} view={view} onClick={() => setSelectedDate(week.date)} />
        ))}
      </div>
    ));
  } else if (view === 'monthly') {
    const months = getMonthlyAggregate(calendarData);
    content = (
      <div className="calendar-week" style={{ display: 'flex', flexDirection: 'row', gap: '10px', marginBottom: '8px', justifyContent: 'center' }}>
        {months.map((month, i) => (
          <CalendarCell key={month.date} day={month} view={view} onClick={() => setSelectedDate(month.date)} />
        ))}
      </div>
    );
  }

  // Export to CSV handler
  const handleExportCSV = () => {
    let exportData = [];
    if (view === 'daily') {
      exportData = calendarData;
    } else if (view === 'weekly') {
      exportData = getWeeklyAggregates(calendarData);
    } else if (view === 'monthly') {
      exportData = getMonthlyAggregate(calendarData);
    }
    const csv = toCSV(exportData, view);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `calendar-${view}.csv`);
  };

  return (
    <Paper className="calendar-grid" elevation={3} sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom>Calendar</Typography>
      {/* Export to CSV button */}
      <ButtonGroup variant="outlined" size="small" sx={{ mb: 2 }}>
        <Button onClick={() => setView('daily')} variant={view === 'daily' ? 'contained' : 'outlined'}>Daily</Button>
        <Button onClick={() => setView('weekly')} variant={view === 'weekly' ? 'contained' : 'outlined'}>Weekly</Button>
        <Button onClick={() => setView('monthly')} variant={view === 'monthly' ? 'contained' : 'outlined'}>Monthly</Button>
        <Button onClick={handleExportCSV} color="success">Export CSV</Button>
      </ButtonGroup>
      {view === 'daily' && (
        <div className="calendar-header">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}
        </div>
      )}
      <div className="calendar-body">
        {loading && <div className="loading">Loading data...</div>}
        {error && <div className="error">Error: {error}</div>}
        {!loading && !error && content}
      </div>
    </Paper>
  );
};

export default Calendar;
