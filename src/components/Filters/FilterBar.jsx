import React, { useState } from "react";
import "./FilterBar.css";
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
// import Box from '@mui/material/Box';

const FilterBar = ({ sectors, securities, onFilterChange }) => {
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedSecurity, setSelectedSecurity] = useState("");

  const handleSectorChange = (e) => {
    const value = e.target.value;
    setSelectedSector(value);
    onFilterChange({ sector: value, security: selectedSecurity });
  };

  const handleSecurityChange = (e) => {
    const value = e.target.value;
    setSelectedSecurity(value);
    onFilterChange({ sector: selectedSector, security: value });
  };

  return (
    <Paper className="filter-bar" elevation={2} sx={{ p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
      <FormControl sx={{ minWidth: 160 }}>
        <InputLabel id="sector-select-label">Sector</InputLabel>
        <Select
          labelId="sector-select-label"
          value={selectedSector}
          label="Sector"
          onChange={handleSectorChange}
        >
          <MenuItem value="">All Sectors</MenuItem>
          {sectors.map((sector, idx) => (
            <MenuItem key={idx} value={sector}>{sector}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 160 }}>
        <InputLabel id="security-select-label">Security</InputLabel>
        <Select
          labelId="security-select-label"
          value={selectedSecurity}
          label="Security"
          onChange={handleSecurityChange}
        >
          <MenuItem value="">All Securities</MenuItem>
          {securities.map((security, idx) => (
            <MenuItem key={idx} value={security}>{security}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};

export default FilterBar;
