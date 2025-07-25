import React, { useContext, useRef } from "react";
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import { DataContext } from "../../context/DataContext";

const getPerformanceColor = (performance) => {
  if (typeof performance !== "number") return "#f5f5f5";
  if (performance > 0) return "#a5d6a7";
  if (performance < 0) return "#ef9a9a";
  return "#f5f5f5";
};

const CalendarCell = ({ day, view, onClick }) => {
  const { selectedDate, setSelectedDate } = useContext(DataContext);
  const todayStr = new Date().toISOString().slice(0, 10);
  const isToday = day.date === todayStr;
  const isSelected = day.date === selectedDate;
  const cellRef = useRef(null);

  const getCellClass = () => {
    let cls = "cell";
    if (isToday) cls += " today";
    if (isSelected) cls += " selected";
    if (day.volatility >= 0.66) cls += " volatility-high";
    else if (day.volatility >= 0.33) cls += " volatility-medium";
    else cls += " volatility-low";
    if (day.isAggregate) cls += " aggregate";
    return cls;
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 700;
  const tooltipPlacement = isMobile ? "bottom" : "top";

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      onClick ? onClick(day) : setSelectedDate(day.date);
    } else if (e.key === "Escape") {
      cellRef.current.blur();
    }
  };

  let tooltipContent;
  if (day.isAggregate && view === "weekly") {
    tooltipContent = (
      <div>
        <div>
          <b>Week:</b> {day.date}
        </div>
        <div>
          <b>Range:</b> {day.weekRange}
        </div>
        <div>
          <b>Avg Price:</b>{" "}
          {typeof day.price === "number" ? (
            `$${day.price}`
          ) : (
            <span style={{ color: "#bbb" }}>—</span>
          )}
        </div>
        <div>
          <b>Avg Volatility:</b>{" "}
          {typeof day.volatility === "number" ? (
            Math.round(day.volatility * 100) + "%"
          ) : (
            <span style={{ color: "#bbb" }}>—</span>
          )}
        </div>
        <div>
          <b>Avg Performance:</b>{" "}
          {typeof day.performance === "number" ? (
            day.performance + "%"
          ) : (
            <span style={{ color: "#bbb" }}>—</span>
          )}
        </div>
        <div>
          <b>Total Volume:</b>{" "}
          {typeof day.volume === "number" ? (
            day.volume.toLocaleString()
          ) : (
            <span style={{ color: "#bbb" }}>—</span>
          )}
        </div>
        <div style={{ marginTop: 6, fontWeight: 600 }}>Daily Stats:</div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 12 }}>
          {day.days &&
            day.days.map((d) => (
              <li key={d.date}>
                {d.date}:{" "}
                {typeof d.performance === "number" ? d.performance + "%" : "—"}
              </li>
            ))}
        </ul>
      </div>
    );
  } else if (day.isAggregate && view === "monthly") {
    tooltipContent = (
      <div>
        <div>
          <b>Month:</b> {day.date}
        </div>
        <div>
          <b>Range:</b> {day.monthRange}
        </div>
        <div>
          <b>Avg Price:</b>{" "}
          {typeof day.price === "number" ? (
            `$${day.price}`
          ) : (
            <span style={{ color: "#bbb" }}>—</span>
          )}
        </div>
        <div>
          <b>Avg Volatility:</b>{" "}
          {typeof day.volatility === "number" ? (
            Math.round(day.volatility * 100) + "%"
          ) : (
            <span style={{ color: "#bbb" }}>—</span>
          )}
        </div>
        <div>
          <b>Avg Performance:</b>{" "}
          {typeof day.performance === "number" ? (
            day.performance + "%"
          ) : (
            <span style={{ color: "#bbb" }}>—</span>
          )}
        </div>
        <div>
          <b>Total Volume:</b>{" "}
          {typeof day.volume === "number" ? (
            day.volume.toLocaleString()
          ) : (
            <span style={{ color: "#bbb" }}>—</span>
          )}
        </div>
        <div style={{ marginTop: 6, fontWeight: 600 }}>Daily Stats:</div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 12 }}>
          {day.days &&
            day.days.map((d) => (
              <li key={d.date}>
                {d.date}:{" "}
                {typeof d.performance === "number" ? d.performance + "%" : "—"}
              </li>
            ))}
        </ul>
      </div>
    );
  } else {
    tooltipContent = (
      <div>
        <div>
          <b>Date:</b> {day.date}
        </div>
        <div>
          <b>Price:</b>{" "}
          {typeof day.price === "number" ? (
            `$${day.price}`
          ) : (
            <span style={{ color: "#bbb" }}>—</span>
          )}
        </div>
        <div>
          <b>Volatility:</b>{" "}
          {typeof day.volatility === "number" ? (
            Math.round(day.volatility * 100) + "%"
          ) : (
            <span style={{ color: "#bbb" }}>—</span>
          )}
        </div>
        <div>
          <b>Performance:</b>{" "}
          {typeof day.performance === "number" ? (
            day.performance + "%"
          ) : (
            <span style={{ color: "#bbb" }}>—</span>
          )}
        </div>
        <div>
          <b>Volume:</b>{" "}
          {typeof day.volume === "number" ? (
            day.volume.toLocaleString()
          ) : (
            <span style={{ color: "#bbb" }}>—</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <Tooltip title={tooltipContent} arrow placement={tooltipPlacement}>
      <div
        ref={cellRef}
        className={getCellClass()}
        onClick={onClick ? () => onClick(day) : () => setSelectedDate(day.date)}
        tabIndex={0}
        aria-label={`Calendar cell for ${day.date}${isToday ? ", today" : ""}${
          isSelected ? ", selected" : ""
        }`}
        role="button"
        aria-pressed={isSelected}
        onKeyDown={handleKeyDown}
        style={{
          outline: isSelected ? "2px solid #1976d2" : undefined,
          minHeight: 70,
          padding: 12,
          margin: 2,
          position: "relative",
          transition: "box-shadow 0.2s, transform 0.2s, outline 0.2s",
          backgroundColor: getPerformanceColor(day.performance),
        }}
      >
        {day.isAggregate && (
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 8,
              background: "#1976d2",
              color: "#fff",
              borderRadius: 8,
              fontSize: 10,
              padding: "2px 6px",
              fontWeight: 600,
            }}
          >
            AGG
          </span>
        )}
        <div className="cell-date">{day.date}</div>
        <div className="cell-data">
          {typeof day.performance === "number" ? (
            `${day.performance}%`
          ) : (
            <span style={{ color: "#bbb" }}>—</span>
          )}
        </div>
      </div>
    </Tooltip>
  );
};

CalendarCell.propTypes = {
  day: PropTypes.object.isRequired,
  view: PropTypes.string,
  onClick: PropTypes.func,
};

export default CalendarCell;
