import React, { useState } from 'react';
import Transactions from './components/Transactions';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';

function App() {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);

  const handleSearch = (text) => {
    setSearchText(text);
    setPage(1);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setPage(1);
  };

  return (
    <div className="App">
      <h1>Transactions Dashboard</h1>

      <div>
        <label>Select Month: </label>
        <select value={selectedMonth} onChange={handleMonthChange}>
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      <Transactions
        selectedMonth={selectedMonth}
        searchText={searchText}
        onSearch={handleSearch}
        page={page}
        onPageChange={setPage}
      />

      <Statistics selectedMonth={selectedMonth} />

      <BarChart selectedMonth={selectedMonth} />
    </div>
  );
}

export default App;
