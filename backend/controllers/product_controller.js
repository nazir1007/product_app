const ProductTransaction = require('../models/product_models');
const axios = require('axios');

// Fetch data from the third-party API and initialize the database with seed data
module.exports.initializeDatabase = async (req, res) => {
    try {
        const response = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';
        const { data } = await axios.get(response);

     try {
        await ProductTransaction.deleteMany();
      } catch (deleteError) {
        console.error('Delete Error:', deleteError);
        return res.status(500).json({ error: 'Failed to delete existing data' });
      }
  
      // Insert new seed data
      try {
        await ProductTransaction.insertMany(data);
      } catch (insertError) {
        console.error('Insert Error:', insertError);
        return res.status(500).json({ error: 'Failed to insert new data' });
      }
  
      res.json({ message: 'Database initialized successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
 
// API to list all transactions with search and pagination support
module.exports.getTransaction = async (req, res) => {
        const { search = '', page = 1, perPage = 10 } = req.query;
        const regex = new RegExp(search, 'i');
        const skip = (page - 1) * perPage;
      
        try {
            const priceSearch = !isNaN(parseFloat(search)) ? parseFloat(search) : null;
            const transactions = await ProductTransaction.find({
            $or: [
              { title: regex },
              { description: regex },
              ...(priceSearch !== null ? [{ price: priceSearch }] : [])
            ]
          })
          .skip(skip)
          .limit(parseInt(perPage));
      
          res.json(transactions);
        } catch (error) {
          res.status(500).json({ error:  'Internal server error' });
        }
      }      
  
// API for statistics of a selected month
module.exports.getStatistics = async (req, res) => {
        const { month } = req.query;
  
        try {
          // Parse the month to a numeric value (1 = January, 12 = December)
          const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;
      
          // Aggregation pipeline to match transactions by the month of dateOfSale
          const transactions = await ProductTransaction.aggregate([
            {
              $match: {
                $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] }
              }
            }
          ]);
      
          const totalSaleAmount = transactions.reduce((sum, trans) => sum + trans.price, 0);
          const totalSoldItems = transactions.filter(trans => trans.sold).length;
          const totalNotSoldItems = transactions.filter(trans => !trans.sold).length;
      
          res.json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
      };
        
// API for bar chart data for a selected month
module.exports.getBarChart = async (req, res) => {
    const { month } = req.query;
  
  try {
    // Parse the month (January = 1, December = 12)
    const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;

    // Fetch all transactions (you can filter this down based on date if performance becomes an issue)
    const transactions = await ProductTransaction.find();

    // Filter transactions by the selected month
    const filteredTransactions = transactions.filter(trans => {
      const saleDate = new Date(trans.dateOfSale);
      return saleDate.getMonth() + 1 === monthIndex;  // +1 to adjust for zero-based month index
    });

  const priceRanges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '301-400', min: 301, max: 400 },
    { range: '401-500', min: 401, max: 500 },
    { range: '501-600', min: 501, max: 600 },
    { range: '601-700', min: 601, max: 700 },
    { range: '701-800', min: 701, max: 800 },
    { range: '801-900', min: 801, max: 900 },
    { range: '901-above', min: 901 }
  ];

const barChartData = priceRanges.map(range => ({
    range: range.range,
    count: filteredTransactions.filter(trans => trans.price >= range.min && (!range.max || trans.price <= range.max)).length
  }));


    res.json(barChartData);
  } catch (error) {
    res.status(500).json({ error:' Internal server error' });
  }
};
  
// API for pie chart data for a selected month
module.exports.getPieChart = async (req, res) => {
    const { month } = req.query;

    try {
      // Parse the month (January = 1, December = 12)
      const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;
  
      // Use aggregation to filter by month and group by category
      const transactions = await ProductTransaction.aggregate([
        {
          $match: {
            $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] }
          }
        },
        {
          $group: {
            _id: "$category", 
            count: { $sum: 1 } 
          }
        }
      ]);
  
      // Format the response to match the expected output
      const pieChartData = transactions.map(trans => ({
        category: trans._id,
        count: trans.count
      }));
  
      // Send the pie chart data as a response
      res.json(pieChartData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}    
  
// Combined API fetching data from other APIs
module.exports.getCombinedData = async (req, res) => {
    const { month } = req.query;
    const baseUrl = 'http://localhost:3000';

  try {
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      axios.get(`${baseUrl}/api/transactions?month=${month}`),
      axios.get(`${baseUrl}/api/statistics?month=${month}`),
      axios.get(`${baseUrl}/api/bar-chart?month=${month}`),
      axios.get(`${baseUrl}/api/pie-chart?month=${month}`)
    ]);

    res.json({
      transactions: transactions.data,
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error'});
  }
}
