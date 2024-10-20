import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Transactions = ({ selectedMonth, searchText, onSearch, onPageChange, page }) => {
  const [transactions, setTransactions] = useState([]);
  const [perPage] = useState(10);

  const fetchTransactions = async (search = '', page = 1) => {
    try {
      const { data } = await axios.get(`/api/transactions`, {
        params: { search, page, perPage, month: selectedMonth }
      });
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions(searchText, page);
  }, [selectedMonth, searchText, page]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search transactions"
        value={searchText}
        onChange={(e) => onSearch(e.target.value)}
      />

      <table border="1" style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((trans, index) => (
            <tr key={index}>
              <td>{trans.title}</td>
              <td>{trans.description}</td>
              <td>{trans.price}</td>
              <td>{new Date(trans.dateOfSale).toLocaleDateString()}</td>
              <td>{trans.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>Previous</button>
        <button onClick={() => onPageChange(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default Transactions;
